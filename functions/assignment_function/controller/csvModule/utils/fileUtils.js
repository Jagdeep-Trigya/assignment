const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");

// Read Excel file and extract data
const readExcelFile = (filePath, sheetName) => {
    const workbook = xlsx.readFile(filePath);
    return xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
};
 
// Rename headers based on a template
const renameHeaders = (data, template) => {
    return data.map(row => {
        const newRow = {};
        for (const [originalHeader, mappedHeader] of Object.entries(template)) {
            if (row.hasOwnProperty(originalHeader)) {
                newRow[mappedHeader] = row[originalHeader];
            }
        }
        return newRow;
    });
};

const convertJsonToCsv = (jsonData, fileName) => {
    const csvPath = path.join(__dirname, "../temp", `${fileName}_${Date.now()}.csv`);
    const worksheet = xlsx.utils.json_to_sheet(jsonData);
    console.log("csvPath-", csvPath)
    const csv = xlsx.utils.sheet_to_csv(worksheet);
    fs.writeFileSync(csvPath, csv);
    return csvPath;
};

module.exports = {
    readExcelFile,
    renameHeaders,
    convertJsonToCsv
};