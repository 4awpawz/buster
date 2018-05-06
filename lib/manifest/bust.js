const path = require("path");
const manifestFileName = require("./manifestFileName");
const replaceInFile = require("replace-in-file");
const writeFile = require("../utils/writeFile");
const copyFile = require("../utils/copyFile");

const saveManifestToFile = async (manifest) => {
    const writeableManifest = {
        "manifest": manifest
    };

    await writeFile(manifestFileName, JSON.stringify(writeableManifest));
};

const backupFiles = async (manifest) => {
    const filtered = manifest.filter(od => od.operation === 2);
    var count = 0;

    for (const item of filtered) {
        await copyFile(item.source, item.backupFileName);
        count++;
    }

    return count;
};

const hashFiles = async manifest => {
    const filtered = manifest.filter(od => od.operation === 1 || od.operation === 3);
    var count = 0;

    for (const item of filtered) {
        await copyFile(item.source, item.hashFileName);
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
    var pathProps;

    for (const item of manifest) {
        /* eslint-disable indent */
        switch (item.operation) {
            case 1:
                pathProps = path.parse(item.source);
                options.from.push(new RegExp(pathProps.name + pathProps.ext, "g"));
                pathProps = path.parse(item.hashFileName);
                options.to.push(`${pathProps.name}${pathProps.ext}`);
                break;
            case 2:
                options.files.push(item.source);
                break;
            case 3:
                options.files.push(item.hashFileName);
                pathProps = path.parse(item.source);
                options.from.push(new RegExp(pathProps.name + pathProps.ext, "g"));
                pathProps = path.parse(item.hashFileName);
                options.to.push(`${pathProps.name}${pathProps.ext}`);
                break;
        }

        await replaceInFile(options);
    };
};

const bust = async (manifest, opDirs, opt) => {
    var backedUpCount = 0;
    var hashedFilesCount = 0;

    if (opt.manifest) {
        await saveManifestToFile(manifest);
        console.log(`manifest file saved to ${manifestFileName}`);
    }

    console.log("creating backup files");
    backedUpCount = await backupFiles(manifest);
    console.log(`${backedUpCount} files have been backed up `);

    console.log("creating hashed files");
    hashedFilesCount = await hashFiles(manifest);
    console.log(`${hashedFilesCount} hashed files have been created`);

    console.log("replacing file content");
    await replaceInFiles(manifest, opDirs);
};

module.exports = bust;