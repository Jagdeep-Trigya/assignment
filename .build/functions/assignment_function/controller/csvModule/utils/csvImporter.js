//-----------------------------
// utils/csvImporter.js
//-----------------------------



async function checkStatusPeriodically(app, jobId) {
    const MAX_RETRIES = 30;  // Maximum retries (30 retries * 5 sec = 150 seconds)
    let retryCount = 0;

    return new Promise((resolve, reject) => {
        const checkStatus = async () => {
            try {
                const statusResult = await app.getStatus(jobId);
                
                if (statusResult.status.toLowerCase() === 'completed') {
                    const downloadUrl = statusResult?.results?.download_url;
                    resolve({ status: "completed", url: downloadUrl });
                    return true; 
                } else if (statusResult.status.toLowerCase() === 'failed') {
                    console.error('Bulk read job failed.', statusResult);
                    resolve({ status: "failed" }); 
                    return true;
                } else {
                    console.log('Job is still processing. Checking again in 5 seconds.');
                    return false;
                }
            } catch (error) {
                reject(error);
                return true;
            }
        };

        const intervalId = setInterval(async () => {
            retryCount++;  // Increment retry count
            
            const isCompleted = await checkStatus();
            
            if (isCompleted) {
                clearInterval(intervalId);
            } else if (retryCount >= MAX_RETRIES) {
                clearInterval(intervalId);
                console.error('Job did not complete within the allowed time.');
                reject(new Error("Job timeout: CSV import took too long to complete.")); 
            }
        }, 5000);  // Check every 5 seconds
    });
}
async function updateDatastore(dataStore, payload) {
    try {
        const result = await dataStore.updateRow(payload);
        return result.ROWID;
    } catch (error) {
        console.error("Error updating datastore:", error);
        throw error;
    }
}
async function bulkWriteRecords(bulkWrite, fileDetails, options){
    // const options = options;
    console.log("options--->",options);
    // const options = {
    //     operation: "insert",
    //     fk_mapping: foreignKeyMappings 
    // };
    const bulkWriteJob = await bulkWrite.createJob(fileDetails, options);
    console.log("🔄 Bulk write job created:", JSON.stringify(bulkWriteJob));

    return { jobId: bulkWriteJob.job_id, status: bulkWriteJob.status };

};

module.exports = {
    checkStatusPeriodically,
    updateDatastore,
    bulkWriteRecords
}