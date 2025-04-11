const catalyst = require("zcatalyst-sdk-node");
const { checkStatusPeriodically, updateDatastore, bulkWriteRecords   } = require('../utils/csvImporter');

async function importCsvdata(app, files, optionsMap, dataStore, ROWID, bucket) {
    try {
        const bulkJobs = {};
        const jobIds = {};

        for (const [table, fileId] of Object.entries(files)) {
            if (!fileId) continue;
            try {
                const fileDetails = { bucket_name: bucket, object_key: fileId };
                const bulkWrite = app.datastore().table(table).bulkJob("write");
                const options = optionsMap[table] || { operation: "insert" };

                const { jobId } = await bulkWriteRecords(bulkWrite, fileDetails, options);
                bulkJobs[table] = bulkWrite;
                jobIds[table] = jobId;
            } catch (error) {
                console.error(`Bulk write failed for ${table}:`, error);
                return { success: false, message: `Bulk write failed for ${table}`, error: error.message };
            }
        }

        // Monitor all bulk job statuses
        const results = await Promise.all(
            Object.entries(jobIds).map(async ([table, jobId]) => ({
                table,
                result: await checkStatusPeriodically(bulkJobs[table], jobId),
            }))
        );
        console.log("Bulk job results:", results);

        const failedJobs = results.filter(({ result }) => result.status !== "completed");
        if (failedJobs.length > 0) {
            console.error("Some jobs failed:", failedJobs);
            return { success: false, message: "Some CSV import jobs failed", failedJobs };
        }

        // await updateDatastore(dataStore, { ROWID, status: "completed" });

        return { success: true, message: "CSV Import Successful!", jobIds };
    } catch (error) {
        console.error("Import failed:", error);
        return { success: false, message: "Import failed", error: error.message };
    }
}

module.exports = { importCsvdata };
