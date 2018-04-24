const fs = require("fs");
const fileExists = require("file-exists");
const manifestFileName = require("./manifestFileName");

const restore = (manifest, opDirs, opt) => {
    console.log("restoring files");

    // od 1, od3 - delete the hashed files
    console.log("deleting hashed files...");
    manifest.filter(od => od.operation === 1 || od.operation === 3).forEach(od => {
        if (fileExists.sync(od.hashFileName)) {
            fs.unlinkSync(od.hashFileName);
        }
    });

    // od 2 - delete the created file and rename the backup file
    console.log("restoring original files from backups...");
    manifest.filter(od => od.operation === 2).forEach(od => {
        if (fileExists.sync(od.source) && fileExists.sync(od.backupFileName)) {
            fs.unlinkSync(od.source);
            fs.renameSync(od.backupFileName, od.source);
        }
    });

    // delete the manifest file too
    if (fileExists.sync(manifestFileName)) {
        console.log(`deleting ${manifestFileName}`);
        fs.unlinkSync(manifestFileName);
    }

    console.log("files restored");
};

module.exports = restore;