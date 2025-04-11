const express =require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { audio, video, attachment } = require("../Utils/fileTypes.js");

const ensureDir = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

const storage = multer.diskStorage({    
    destination: (req, file, cb) => {
        console.log("<------>",req.files['file']);
        if (file.fieldname === 'file') {
            ensureDir('temp/attachments');
            cb(null, 'temp/attachments');
        }
        else {
            cb(new Error('Unknown field name'), false);
        }
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const allowedMimeTypes = ["video/mp4", "video/webm", "application/octet-stream"];

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    console.log({file:file.originalname});
    console.log({fieldname:file.fieldname}); 
    if (file.fieldname === 'file' && (attachment.includes(ext)|| video.includes(ext) ||audio.includes(ext) || allowedMimeTypes.includes(file.mimetype))) {
        cb(null, true);
    }
    else {
        cb(new Error('Invalid file type'), false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

//*********csvModule FUNCTION ********* */

const { testFileConnections, uploadCsv } = require("../controller/csvModule/csvUploadController");

router.get("/test-file-connections", testFileConnections);
router.post("/upload-csvdata", upload.fields([ { name: "file", maxCount: 1 }]), uploadCsv);


// ***************CSV IMPORT FUNCTION ********
const {testFileImportConnections, importCsvFile} =  require("../controller/csvModule/csvImportController.js");
router.get('/test-file-import-connections', testFileImportConnections);
router.post('/import-csv-files', importCsvFile);

module.exports = router;
