const fs = require("fs");
const path = require("path");
const replaceInFile = require("replace-in-file");

const saveManifestToFile = (manifest, fileName) => {
    var writeableManifest = {
        "manifest": manifest
    };

    fs.writeFileSync(fileName, JSON.stringify(writeableManifest));

    console.log(`manifest written to ${fileName}`);
};

const backupFiles = (manifest) => {
    var filt = manifest.filter(od => od.operation === 2);
    var count = 0;

    if (filt) {
        filt.forEach(od => {
            fs.copyFileSync(od.source, od.backupFileName);
            count++;
        });
    }

    return count;
};

const hashFiles = (manifest) => {
    var filt = manifest.filter(od => od.operation === 1 || od.operation === 3);
    var count = 0;

    if (filt) {
        filt.forEach(od => {
            fs.copyFileSync(od.source, od.hashFileName);
            count++;
        });
    }

    return count;
};

const replaceInFiles = (manifest, opDirs) => {
    var options = {
        files: [],
        from: [],
        to: []
    };
    var pathProps;

    manifest.forEach(od => {
        /* eslint-disable indent */
        switch (od.operation) {
            case 1:
                pathProps = path.parse(od.source);
                options.from.push(new RegExp(pathProps.name + pathProps.ext, "g"));
                pathProps = path.parse(od.hashFileName);
                options.to.push(`${pathProps.name}${pathProps.ext}`);
                break;
            case 2:
                options.files.push(od.source);
                break;
            case 3:
                options.files.push(od.hashFileName);
                pathProps = path.parse(od.source);
                options.from.push(new RegExp(pathProps.name + pathProps.ext, "g"));
                pathProps = path.parse(od.hashFileName);
                options.to.push(`${pathProps.name}${pathProps.ext}`);
                break;
        }
    });

    console.log("options", options);
    console.log(replaceInFile.sync(options));
};

const bust = (manifest, opDirs, opt) => {
    var backedUpCount = 0;
    var hashedFilesCount = 0;

    if (opt.manifestDest) {
        saveManifestToFile(manifest, opt.manifestDest);
        console.log(`manifest file saved to ${opt.manifestDest}`);
    }

    console.log("creating backup files");
    backedUpCount = backupFiles(manifest);
    console.log(`${backedUpCount} files have been backed up `);

    console.log("creating hashed files");
    hashedFilesCount = hashFiles(manifest);
    console.log(`${hashedFilesCount} hashed files have been created`);

    console.log("replacing file content");
    replaceInFiles(manifest, opDirs);
};

module.exports = bust;