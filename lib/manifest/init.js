const path = require("path");
const checkRange = require("../utils").checkRange;
const hashFileName = require("../utils").hashFileName;
const isDirectory = require("../utils/isDirectory");
const log = require("../utils/log");

const hashes = [];

const rangeIsValid = value => checkRange(value, 1, 3);

const addOpDirToManifest = async (manifest, od) => {
    const odParts = od.split(":");
    const item = {};

    item.source = odParts[0];

    // validate operation
    if (rangeIsValid(odParts[1])) {
        item.operation = parseInt(odParts[1], 10);
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
        const hash = await hashFileName(item.source)
            .catch(e => log(`file ${item.source} not found for hashing`));
        hashes.push(hash);

        const pathProps = path.parse(item.source);
        item.hashFileName = `${pathProps.name}.${hash}${pathProps.ext}`;
        count++;
    }

    return count;
};

const removePhantoms = manifest => {
    /*
        When restoring, glob will have returned paths for files
        that were hashed during busting. This removes them.
    */
    const cleanse = source => hashes.some(hash => source.indexOf(hash) !== -1);

    return manifest.filter(item => !cleanse(item.source));
};

const backupFileName = manifest => {
    let count = 0;

    manifest.filter(item => item.operation === 2).forEach(od => {
        let pathProps;

        pathProps = path.parse(od.source);
        od.backupFileName = `${pathProps.name}.buster-copy${pathProps.ext}`;
        count++;
    });

    return count;
};

const init = async (opDirs, command) => {
    let manifest = [];

    for (const directive of opDirs) {
        await addOpDirToManifest(manifest, directive);
    }

    log("operational directives validated");
    log(`manifest contains ${manifest.length} files`);
    await hashFileNames(manifest);
    if (command === "restore") {
        manifest = removePhantoms(manifest);
        for (const item of manifest) {
            log("cleansed manifest item", item);
        }
    }
    log(`${manifest.filter(item =>
        item.operation === 1 ||
        item.operation === 3).length} file name(s) have been hashed`);
    log(`${backupFileName(manifest)} backup file name(s) have been created`);

    return manifest;
};

module.exports = init;