const path = require("path");
const fileExists = require("file-exists");
const checkRange = require("../utils").checkRange;
const hashFileName = require("../utils").hashFileName;
const isDirectory = require("../utils/isDirectory");
const log = require("../utils/log");

const rangeIsValid = value => checkRange(value, 1, 3);

const addOpDirToManifest = async (manifest, od) => {
    const odParts = od.split(":");
    const item = {};

    // validate source
    if (await fileExists(path.resolve(odParts[0]))) {
        item.source = odParts[0];
    } else {
        throw new Error(`error: source file "${odParts[0]}" doesn't exist`);
    }

    // validate operation
    if (rangeIsValid(odParts[1])) {
        item.operation = parseInt(odParts[1]);
    } else {
        throw new Error(`error: invalid operation found - "${odParts[1]}" is invalid`);
    }

    // validate destination
    if (isDirectory(odParts[2])) {
        item.dest = odParts[2];
    } else {
        throw new Error(`error: destination path "${odParts[2]}" doesn't exist`);
    }

    manifest.push(item);
};

const hashFileNames = async manifest => {
    const filtered = manifest.filter(od => od.operation === 1 || od.operation === 3);
    let count = 0;

    for (const item of filtered) {
        const hash = await hashFileName(item.source);
        const pathProps = path.parse(item.source);

        item.hashFileName = `${pathProps.name}.${hash}${pathProps.ext}`;
        count++;
    }

    return count;
};

const backupFileName = manifest => {
    let count = 0;

    manifest.filter(item => item.operation === 2).forEach(od => {
        let pathProps;

        pathProps = path.parse(od.source);
        od.backupFileName = `${pathProps.dir}${path.sep}${pathProps.name}.buster-copy${pathProps.ext}`;
        count++;
    });

    return count;
};

const init = async (opDirs) => {
    const manifest = [];

    for (const directive of opDirs) {
        await addOpDirToManifest(manifest, directive);
    }

    log("operational directives validated");
    log(`manifest contains ${manifest.length} files`);
    log(`${await hashFileNames(manifest)} file name(s) have been hashed`);
    log(`${backupFileName(manifest)} backup file name(s) have been created`);

    return manifest;
};

module.exports = init;