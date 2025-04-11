const catalyst = require("zcatalyst-sdk-node");
const fs = require("fs");
const uploadToStratus = async (req, bucketName, filePath, originalName) => {
    const app = catalyst.initialize(req, { scope: "admin" });
    const stratus = app.stratus();
    const bucket = stratus.bucket(bucketName);
    const fileStream = fs.createReadStream(filePath);
    const uniqueKey = `${Date.now()}-${originalName}`;
    const result = await bucket.putObject(uniqueKey, fileStream);
    return { id: uniqueKey, name: originalName, filePath: result.url, bucket: bucketName };
};

module.exports = {
    uploadToStratus
};