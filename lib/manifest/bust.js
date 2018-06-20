const path = require("path");
const manifestFileName = require("./manifestFileName");
const replaceInFile = require("replace-in-file");
const writeFile = require("../utils/writeFile");
const copyFile = require("../utils/copyFile");
const makeDir = require("make-dir");
const rename = require("../utils/rename");
const log = require("../utils/log");

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
            console.log(`${item.source} coppied to ${item.dest}`);
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

    await replaceInFile(options);
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