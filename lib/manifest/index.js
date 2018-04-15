const fs = require("fs");
const path = require("path");
const fileExists = require("file-exists");
const checkRange = require("../utils").checkRange;
const hashFileName = require("../utils").hashFileName;

const manifest = [];

const rangeIsValid = value => checkRange(value, 1, 3);

const addOpDirToManifest = directive => {
    var parts = directive.split(":");
    var exists = false;
    var entry = {};

    // validate source
    exists = fileExists.sync(path.resolve(parts[0]));
    if (!exists) {
        console.log(`source file "${parts[0]}" doesn't exist`);
        console.log("terminating process");
        process.exit();
    } else {
        entry.source = path.resolve(parts[0]);
    }
    // validate directive
    if (!rangeIsValid(parts[1])) {
        console.log(`source file's directive "${parts[1]}" is invalid`);
        console.log("terminating process");
        process.exit();
    } else {
        entry.operation = parseInt(parts[1]);
    }
    // validate destination
    exists = path.resolve(parts[2]);
    if (!exists) {
        console.log(`destingation "${parts[2]}" doesn't exist`);
        console.log("terminating process");
        process.exit();
    } else {
        entry.dest = path.resolve(parts[2]);
    }
    // add entry to manifest
    manifest.push(entry);
};

const hashFileNames = () => {
    var count = 0;
    manifest.forEach(od => {
        var pathProps;
        if (od.operation === 1 || od.operation === 3) {
            od.hash = hashFileName(od.source);
            pathProps = path.parse(od.source);
            od.hashFileName = `${pathProps.dir}${path.sep}${pathProps.name}.${od.hash}${pathProps.ext}`;
            count++;
        }
    });
    return count;
};

const backupFileName = () => {
    var count = 0;
    manifest.forEach(od => {
        var pathProps;
        if (od.operation === 2 || od.operation === 3) {
            pathProps = path.parse(od.source);
            od.backupFileName = `${pathProps.dir}${path.sep}${pathProps.name}.buster-copy.${pathProps.name}${pathProps.ext}`;
            count++;
        }
    });
    return count;
};

const saveManifestToFile = (fileName) => {
    var writeableManifest = {
        "manifest": manifest
    };
    fs.writeFileSync(fileName, JSON.stringify(writeableManifest));
    console.log(`manifest written to ${fileName}`);
}

const manifestFactory = () => (opDirs, opt) => {
    var hashedCount = 0;
    var backupCount = 0;
    opDirs.forEach(directive => addOpDirToManifest(directive));
    console.log("operational directives validated");
    console.log(`manifest contains ${manifest.length} operational directives`);
    hashedCount = hashFileNames();
    console.log(`${hashedCount} file name(s) have been hashed`);
    backupCount = backupFileName();
    console.log(`${backupCount} backup file name(s) have been created`);
    if (opt.manifestFileName) {
        saveManifestToFile(opt.manifestFileName);
    }
    console.log("manifest", manifest);
};

module.exports = manifestFactory;
