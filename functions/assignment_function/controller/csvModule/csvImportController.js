const csvImportService = require("./services/csvImportService");
const catalyst = require("zcatalyst-sdk-node");
exports.testFileImportConnections = async (req, res) => {
    res.status(200).json({ success: true, message: "CSV connections are working" });
};
exports.importCsvFile = async (req, res) => {
    try {
        const { 
            moduleName,
            usersFileId,
            bucketName,
            ROWID } = req.body;
        if (!moduleName) {
            return res.status(400).json({ success: false, message: "Module name is required" });
        }
        const app = catalyst.initialize(req, { scope: "admin" });
        const stratus = app.stratus();
        let dataStore = app.datastore().table("dataRequest");


        const files = {
            userData: usersFileId
        };

        if (Object.values(files).every(file => !file)) {
            return res.status(400).json({ success: false, message: "No valid file IDs provided" });
        }

        const optionsMap = {
            users: { operation: "insert" }
        };

        const result = await csvImportService.importCsvdata(app, files, optionsMap, dataStore, ROWID, bucketName);
        console.log("result", result);
        res.status(200).json({ success: true, message: "Import successfully", result });
    } catch (error) {
        res.status(500).json({ success: false, message: "Import failed", error: error.message });
    }
};
