"use strict";
const path = require("path");
const makeDir = require("make-dir");
const { copyFile, log, readFile, rename, writeFile } = require("../utils");
const manifestFileName = require("./manifestFileName");

const saveManifestToFile = async (manifest) => {
    const writeableManifest = {
        "manifest": manifest
    };

    await writeFile(manifestFileName, JSON.stringify(writeableManifest));
};

const backupFiles = async (manifest) => {
    const filtered = manifest.filter(item => item.operation === 2);
    for (const item of filtered) {
        if (path.resolve(path.dirname(item.source)) === path.resolve(item.dest)) {
            await copyFile(item.source, item.backupFileName);
        } else {
            await makeDir(item.dest);
            await copyFile(item.source, `${item.dest}${path.sep}${path.basename(item.source)}`);
            log(`${item.source} copied to ${item.dest}`);
        }
    }

    return filtered.length;
};

const hashFiles = async (manifest, opt) => {
    const filtered = manifest.filter(item => item.operation === 1 || item.operation === 3);
    for (const item of filtered) {
        if (!opt.safeMode) {
            await makeDir(item.dest);
            await copyFile(item.source, `${item.dest}${path.sep}${item.hashFileName}`);
        } else {
            await rename(item.source, `${path.dirname(item.source)}${path.sep}${item.hashFileName}`);
        }
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
        options.from.push(new RegExp(path.basename(item.source), "g"));
        options.to.push(`${item.hashFileName}`);
    });

    manifest.filter(item => item.operation === 2).forEach(item => {
        options.files.push(`${item.dest}${path.sep}${path.basename(item.source)}`);
    });

    manifest.filter(item => item.operation === 3).forEach(item => {
        options.files.push(`${item.dest}${path.sep}${item.hashFileName}`);
        options.from.push(new RegExp(path.basename(item.source), "g"));
        options.to.push(`${item.hashFileName}`);
    });

    for (let iFile = 0; iFile < options.files.length; iFile++) {
        let fileBuffer = await readFile(options.files[iFile], {encoding: "utf8", flag: "r+"});
        for (let i = 0; i < options.from.length; i++) {
            fileBuffer = fileBuffer.replace(options.from[i], options.to[i]);
        }
        await writeFile(options.files[iFile], fileBuffer);
    }
};

const bust = async (manifest, opDirs, opt) => {
    if (opt.manifest) {
        await saveManifestToFile(manifest);
        log(`manifest file saved to ${manifestFileName}`);
    }

    if (!opt.safeMode) {
        log("creating backup files");
        log(`${await backupFiles(manifest)} files have been backed up `);
    }

    log("creating hashed files");
    log(`${await hashFiles(manifest, opt)} hashed files have been created`);

    log("replacing file content");
    await replaceInFiles(manifest);

    console.log("files cache busted");
};

module.exports = bust;