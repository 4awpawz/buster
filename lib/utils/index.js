const checkRange = require("./checkRange");
const mergeObjects = require("./mergeObjects");
const hashFileName = require("./hashFileName");
const readFile = require("./readFile");
const fileExists = require("file-exists");
const unlink = require("./unlink");
const rename = require("./rename");
const writeFile = require("./writeFile");
const copyFile = require("./copyFile");

module.exports = {
    checkRange: checkRange,
    mergeObject: mergeObjects,
    hashFileName: hashFileName,
    readFile: readFile,
    fileExists: fileExists,
    unlink: unlink,
    rename: rename,
    writeFile: writeFile,
    copyFile: copyFile
};