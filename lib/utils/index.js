const checkRange = require("./checkRange");
const mergeObjects = require("./mergeObjects");
const hashFileName = require("./hashFileName");
const readFile = require("./readFile");
const fileExists = require("file-exists");
const unlink = require("./unlink");
const rename = require("./rename");
const writeFile = require("./writeFile");
const copyFile = require("./copyFile");
const dedupe = require("./dedupe");
const glob = require("./glob");
const expandGlob = require("./expandGlob");

module.exports = {
    checkRange: checkRange,
    mergeObject: mergeObjects,
    hashFileName: hashFileName,
    readFile: readFile,
    fileExists: fileExists,
    unlink: unlink,
    rename: rename,
    writeFile: writeFile,
    copyFile: copyFile,
    dedupe: dedupe,
    glob: glob,
    expandGlob: expandGlob
};