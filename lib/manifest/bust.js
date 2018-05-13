const path = require("path");
const manifestFileName = require("./manifestFileName");
const replaceInFile = require("replace-in-file");
const writeFile = require("../utils/writeFile");
const copyFile = require("../utils/copyFile");
const makeDir = require("make-dir");

const saveManifestToFile = async (manifest) => {
    const writeableManifest = {
        "manifest": manifest
    };

    await writeFile(manifestFileName, JSON.stringify(writeableManifest));
};

const backupFiles = async (manifest) => {
    const filtered = manifest.filter(item => item.operation === 2);
    let count = 0;

    for (const item of filtered) {
        if (path.dirname(item.source) === path.normalize(item.dest)) {
            await copyFile(item.source, item.backupFileName);
        } else {
            await makeDir(item.dest);
            await copyFile(item.source, `${item.dest}${path.sep}${path.basename(item.source)}`);
        }
        count++;
    }

    return count;
};

const hashFiles = async manifest => {
    const filtered = manifest.filter(item => item.operation === 1 || item.operation === 3);
    let count = 0;

    for (const item of filtered) {
        await makeDir(item.dest);
        await copyFile(item.source, `${item.dest}${path.sep}${item.hashFileName}`);
        count++;
    }

    return count;
};

const replaceInFiles = async (manifest, opDirs) => {
    const options = {
        files: [],
        from: [],
        to: []
    };

    for (const item of manifest) {
        /* eslint-disable indent */
        switch (item.operation) {
            case 1:
                options.from.push(new RegExp(path.basename(item.source), "g"));
                options.to.push(`${item.hashFileName}`);
                break;
            case 2:
                options.files.push(`${item.dest}${path.sep}${path.basename(item.source)}`);
                break;
            case 3:
                options.files.push(`${item.dest}${path.sep}${item.hashFileName}`);
                options.from.push(new RegExp(path.basename(item.source), "g"));
                options.to.push(`${item.hashFileName}`);
                break;
        }

        await replaceInFile(options);
    };
};

const bust = async (manifest, opDirs, opt) => {
    if (opt.manifest) {
        await saveManifestToFile(manifest);
        console.log(`manifest file saved to ${manifestFileName}`);
    }

    console.log("creating backup files");
    console.log(`${await backupFiles(manifest)} files have been backed up `);

    console.log("creating hashed files");
    console.log(`${await hashFiles(manifest)} hashed files have been created`);

    console.log("replacing file content");
    await replaceInFiles(manifest, opDirs);
};

module.exports = bust;