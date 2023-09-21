"use strict";
const path = require("path");
const { checkRange, getHash, log, readFile } = require("../utils");

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

    manifest.push(item);
};

const hashFileNames = async (manifest) => {
    const filtered = manifest.filter(od => od.operation === 1 || od.operation === 3);

    for (const item of filtered) {
        let hash;
        try {
            const buffer = await readFile(item.source);
            // Introduced in v1.1.0 - include file's path to its content to reduce hash collisioins when more than one file is empty.
            // hash = await hashFileName.async(item.source + buffer, { algorithm: "md5" });
            hash = getHash(item.source + buffer);
        } catch (error) {
            log(`file ${item.source} not found for hashing`);
        }
        const parsed = path.parse(item.source);
        // if name contains periods then split name by period and append hash after 1st period otherwise just append hash to name
        const nameParts = parsed.name.split(".");
        nameParts.length > 1 && nameParts.splice(1, 0, hash);
        const hFileName = nameParts.length > 1 && nameParts.join((".")) || parsed.name + "." + hash;
        item.hashFileName = `${hFileName}${parsed.ext}`;
        // the original URL is what is seached for in files whose own content is to be searched for URLs and
        // in the chance that buster is running on windows we need to convert back slashes ("\") to forward slashes {"/"}
        item.originalURL = item.source.substring(item.source.indexOf(path.sep)).replace(path.win32.sep, path.posix.sep);
        // the hashed URL will replace the original URL in files whose own content is to be searched for URLs
        item.hashedURL = item.originalURL.replace(path.parse(item.source).base, item.hashFileName);
    }
};

module.exports = async (opDirs) => {
    const manifest = [];

    for (const directive of opDirs) {
        await addOpDirToManifest(manifest, directive);
    }

    log("operational directives validated");
    log(`manifest contains ${manifest.length} files`);
    await hashFileNames(manifest);
    log(`${manifest.filter(item =>
        item.operation === 1 ||
        item.operation === 3).length} file name(s) have been hashed`);
    log(`${manifest.filter(item =>
        item.operation === 2 ||
        item.operation === 3).length} file(s) have been targeted to have their content updated`);

    return manifest;
};