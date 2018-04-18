const path = require("path");
const fileExists = require("file-exists");
const checkRange = require("../utils").checkRange;
const hashFileName = require("../utils").hashFileName;

const rangeIsValid = value => checkRange(value, 1, 3);

const addOpDirToManifest = (manifest, directive) => {
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
        entry.source = parts[0];
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
        console.log(`destination path "${parts[2]}" doesn't exist`);
        console.log("terminating process");
        process.exit();
    } else {
        entry.dest = parts[2];
    }

    // add entry to manifest
    manifest.push(entry);
};

const hashFileNames = manifest => {
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

const backupFileName = manifest => {
    var count = 0;

    manifest.forEach(od => {
        var pathProps;

        if (od.operation === 2) {
            pathProps = path.parse(od.source);
            od.backupFileName = `${pathProps.dir}${path.sep}${pathProps.name}.buster-copy${pathProps.ext}`;
            count++;
        }
    });
    return count;
};

const init = (manifest, opDirs) => {
    var hashedCount = 0;
    var backupCount = 0;

    opDirs.forEach(directive => addOpDirToManifest(manifest, directive));
    console.log("operational directives validated");
    console.log(`manifest contains ${manifest.length} operational directives`);

    hashedCount = hashFileNames(manifest);
    console.log(`${hashedCount} file name(s) have been hashed`);

    backupCount = backupFileName(manifest);
    console.log(`${backupCount} backup file name(s) have been created`);
};

module.exports = init;