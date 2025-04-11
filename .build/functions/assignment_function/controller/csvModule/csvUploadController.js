
const csvUploadService = require("./services/csvUploadService");
const usersModel = require("./models/usersModel");

exports.testFileConnections = async(req, res) =>{
    res.status(200).json({ success: true, message: "CSV connections are working" });
};
exports.uploadCsv = async (req, res) => {
    try {
        const { bucketName, template,moduleName } = req.body;
        const fileData = req.files?.file?.[0];
        console.log("fileData--->", fileData);
        if (!fileData || (!fileData.originalname.endsWith(".xls") && !fileData.originalname.endsWith(".xlsx"))) {
            return res.status(400).json({ success: false, message: "Only .xls or .xlsx files are allowed" });
        }
        console.log("moduleName--->", moduleName);
   
        const availableModels = { users: usersModel.users };
        
        const result = await csvUploadService.processCsvUpload(req, bucketName, fileData, availableModels);
        console.log("reult--->", result);
        res.status(200).json({
            success: true,
            message: "File processed and uploaded successfully",
            result
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "File processing failed", error: error.message });
    }
};