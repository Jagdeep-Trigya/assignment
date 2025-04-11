const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");

// Read Excel file and extract data
const readExcelFile = (filePath, sheetName) => {
    const workbook = xlsx.readFile(filePath);
    return xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
};
 
// Rename headers based on a template
// const renameHeaders = (data, template) => {
//     return data.map(row => {
//         const newRow = {};
//         for (const [originalHeader, mappedHeader] of Object.entries(template)) {
//             if (row.hasOwnProperty(originalHeader)) {
//                 newRow[mappedHeader] = row[originalHeader];
//             }
//         }
//         return newRow;
//     });
// };
const renameHeaders = (data, template) => {
    return data.map(row => {
        const newRow = {};
        for (const [originalHeader, mappedHeader] of Object.entries(template)) {
            // Handle missing values by defaulting to "null"
            newRow[mappedHeader] = row.hasOwnProperty(originalHeader) 
                ? row[originalHeader] 
                : "null";
        }
        return newRow;
    });
};
// const renameHeaders = (data, template) => {
//     return data.map(row => {
//         const newRow = {};
//         for (const [originalHeader, mappedHeader] of Object.entries(template)) {
//             // Set to "NULL" if the original header is missing
//             newRow[mappedHeader] = row.hasOwnProperty(originalHeader) ? row[originalHeader] : "null";
//         }
//         return newRow;
//     });
// };

// Convert JSON to CSV
// const convertJsonToCsv = (jsonData, fileName) => {
//     const cleanedData = jsonData.map(row => {
//         return Object.fromEntries(
//             Object.entries(row).map(([key, value]) => {
//                 // Convert null/undefined/empty to "NULL"
//                 if (value === null || value === undefined || value === "") {
//                     return [key, "null"];
//                 }
//                 // Convert booleans to "TRUE"/"FALSE"
//                 if (typeof value === "boolean") {
//                     return [key, value ? "true" : "false"];
//                 }
//                 // Trim strings and handle other types without manual quoting
//                 if (typeof value === "string") {
//                     return [key, value.trim()];
//                 }
//                 // Stringify arrays/objects
//                 if (Array.isArray(value) || typeof value === "object") {
//                     return [key, JSON.stringify(value)];
//                 }
//                 // Return other types as-is (numbers, etc.)
//                 return [key, value];
//             })
//         );
//     });

//     const csvPath = path.join(__dirname, "../temp", `${fileName}_${Date.now()}.csv`);
//     const worksheet = xlsx.utils.json_to_sheet(cleanedData);
//     const csv = xlsx.utils.sheet_to_csv(worksheet, { FS: "," });
//     fs.writeFileSync(csvPath, csv);
//     return csvPath;
// };


const convertJsonToCsv = (jsonData, fileName) => {
    console.log("jsonData--->", jsonData);
    const cleanedData = jsonData.map(row => {
        return Object.fromEntries(
            Object.entries(row).map(([key, value]) => {
                // Convert all falsy values (null, undefined, empty strings) to "null"
                if (!value && value !== 0 && value !== false) {
                    return [key, "null"];
                }

                // Handle boolean-like strings from Excel (e.g., "TRUE" -> "true")
                if (typeof value === "string") {
                    const trimmed = value.trim().toLowerCase();
                    if (trimmed === "'true" || trimmed === "'false") {
                        return [key, trimmed];
                    }
                }

                // Convert boolean values to lowercase strings
                if (typeof value === "boolean") {
                    return [key, value ? "true" : "false"];
                }

                // Handle arrays/objects
                if (Array.isArray(value) || typeof value === "object") {
                    return [key, JSON.stringify(value)];
                }

                // Return numbers and other types as-is
                return [key, value];
            })
        );
    });

    const csvPath = path.join(__dirname, "../temp", `${fileName}_${Date.now()}.csv`);
    const worksheet = xlsx.utils.json_to_sheet(cleanedData);
    const csv = xlsx.utils.sheet_to_csv(worksheet, { FS: "," });
    fs.writeFileSync(csvPath, csv);
    return csvPath;
};


// const convertJsonToCsv = (jsonData, fileName) => {
//     const csvPath = path.join(__dirname, "../temp", `${fileName}_${Date.now()}.csv`);
//     const worksheet = xlsx.utils.json_to_sheet(jsonData);
//     console.log("csvPath-", csvPath)
//     const csv = xlsx.utils.sheet_to_csv(worksheet);
//     fs.writeFileSync(csvPath, csv);
//     return csvPath;
// };

module.exports = {
    readExcelFile,
    renameHeaders,
    convertJsonToCsv
};