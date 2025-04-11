const catalyst = require("zcatalyst-sdk-node");
const xlsx = require("xlsx"); 
const fs = require("fs").promises;
const { readExcelFile, renameHeaders, convertJsonToCsv } = require("../utils/fileUtils");
const { uploadToStratus } = require("../utils/stratusUtils");
const processCsvUpload = async (req, bucketName, fileData, template) => {
    const workbook = xlsx.readFile(fileData.path);
    const sheetNames = workbook.SheetNames;
    console.log("sheetNames--->",sheetNames);
    // if (!sheetNames.includes("leads") || !sheetNames.includes("leadInformations")) {
    //     throw new Error(`Missing required sheets: 'leads' and 'leadInformations'. Found: ${sheetNames.join(", ")}`);
    // }
    const uploadPromises = sheetNames.map(async (sheetName) => {
        if (!template[sheetName]) {
            console.warn(`Skipping unrecognized sheet: ${sheetName}`);
            return null;
        }

        let data = readExcelFile(fileData.path, sheetName);
        // console.log(`Raw Data (${sheetName}):`, data);

        data = renameHeaders(data, template[sheetName]);
        // console.log(`Renamed Headers (${sheetName}):`, data);

        const csvPath = convertJsonToCsv(data, sheetName);
        // console.log(`CSV Path (${sheetName})--->`, csvPath);

        const uploadResult = await uploadToStratus(req, bucketName, csvPath, `${sheetName}.csv`);
        
        // Cleanup: Delete temporary CSV file after upload
        await fs.unlink(csvPath).catch(err => console.error(`Failed to delete ${csvPath}:`, err));

        return { [sheetName]: uploadResult };
    });

    const results = await Promise.all(uploadPromises);
    return Object.assign({}, ...results.filter(Boolean)); 
};

module.exports = {
    processCsvUpload
};