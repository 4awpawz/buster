"use strict";
const path = require("path");
const { log, readFile, rename, writeFile } = require("../utils");
const manifestFileName = require("./manifestFileName");

const saveManifestToFile = async (manifest) => {
    const writeableManifest = { manifest };

    await writeFile(manifestFileName, JSON.stringify(writeableManifest));
};

const fingerprintFileNames = async (manifest) => {
    const filtered = manifest.filter(item => item.operation === 1 || item.operation === 3);

    for (const item of filtered) {
        await rename(item.source, `${path.dirname(item.source)}${path.sep}${item.hashFileName}`);
    }
    return filtered.length;
};

const replaceInFiles = async (manifest) => {
    const options = {
        files: [],
        from: [],
        to: []
    };

    manifest.filter(item => item.operation === 1).forEach(item => {
        options.from.push(new RegExp(item.originalURL, "g"));
        options.to.push(item.hashedURL);
    });

    manifest.filter(item => item.operation === 2).forEach(item => {
        options.files.push(item.source);
    });

    manifest.filter(item => item.operation === 3).forEach(item => {
        options.files.push(`${path.dirname(item.source)}${path.sep}${item.hashFileName}`);
        options.from.push(new RegExp(item.originalURL, "g"));
        options.to.push(item.hashedURL);
    });

    for (let i = 0; i < options.files.length; i++) {
        let fileBuffer = await readFile(options.files[i], { encoding: "utf8", flag: "r+" });
        for (let ii = 0; ii < options.from.length; ii++) {
            fileBuffer = fileBuffer.replace(options.from[ii], options.to[ii]);
        }
        await writeFile(options.files[i], fileBuffer);
    }
};

module.exports = async (manifest, opt) => {
    if (opt.manifest) {
        await saveManifestToFile(manifest);
        log(`manifest file saved to ${manifestFileName}`);
    }

    log("fingerprinting file names");
    const fingerprintedCount = await fingerprintFileNames(manifest);
    log(`${fingerprintedCount} ${fingerprintedCount === 1 && "file has" || "files have"} been Fingerprinted`);

    log("replacing file content");
    await replaceInFiles(manifest);

    console.log("files cache busted");
};