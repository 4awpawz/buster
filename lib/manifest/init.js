const path = require("path");
const fileExists = require("file-exists");
const checkRange = require("../utils").checkRange;
const hashFileName = require("../utils").hashFileName;

const rangeIsValid = value => checkRange(value, 1, 3);

const addOpDirToManifest = async (manifest, directive) => {
    const parts = directive.split(":");
    var exists = false;
    var od = {};

    // validate source
    exists = await fileExists(path.resolve(parts[0]));
    if (exists) {
        od.source = parts[0];
    } else {
        throw new Error(`error: source file "${parts[0]}" doesn't exist`);
    }

    // validate directive
    if (rangeIsValid(parts[1])) {
        od.operation = parseInt(parts[1]);
    } else {
        throw new Error(`error: source file's directive "${parts[1]}" is invalid`);
    }

    // validate destination
    exists = path.resolve(parts[2]);
    if (exists) {
        od.dest = parts[2];
    } else {
        throw new Error(`error: destination path "${parts[2]}" doesn't exist`);
    }

    manifest.push(od);
};

const hashFileNames = async manifest => {
    const filtered = manifest.filter(od => od.operation === 1 || od.operation === 3);
    var count = 0;

    for (const od of filtered) {
        var pathProps;
        od.hash = await hashFileName(od.source);
        pathProps = path.parse(od.source);
        od.hashFileName = `${pathProps.dir}${path.sep}${pathProps.name}.${od.hash}${pathProps.ext}`;
        count++;
    }

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

const init = async (opDirs) => {
    const manifest = [];

    for (const directive of opDirs) {
        await addOpDirToManifest(manifest, directive);
    }

    console.log("operational directives validated");
    console.log(`manifest contains ${manifest.length} operational directives`);
    console.log(`${await hashFileNames(manifest)} file name(s) have been hashed`);
    console.log(`${backupFileName(manifest)} backup file name(s) have been created`);

    return manifest;
};

module.exports = init;