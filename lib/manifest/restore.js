const path = require("path");
const fileExists = require("file-exists");
const unlink = require("../utils/unlink");
const rename = require("../utils/rename");
const manifestFileName = require("./manifestFileName");

const restore = async (manifest) => {
    var filtered;

    console.log("restoring files");

    // od 1, od3 - delete the hashed files
    console.log("deleting hashed files...");

    filtered = manifest.filter(item => item.operation === 1 || item.operation === 3);
    for (const item of filtered) {
        if (await fileExists(`${item.dest}${path.sep}${item.hashFileName}`)) {
            await unlink(`${item.dest}${path.sep}${item.hashFileName}`);
        }
    }

    // od 2 - delete the created file and rename the backup file
    console.log("restoring original files from backups...");
    filtered = manifest.filter(item => item.operation === 2);
    for (const item of filtered) {
        if (path.dirname(item.source) === path.normalize(item.dest)) {
            if (await fileExists(item.source) && await fileExists(item.backupFileName)) {
                await unlink(item.source);
                await rename(item.backupFileName, item.source);
            }
        } else {
            await unlink(`${item.dest}${path.sep}${path.basename(item.source)}`);
        }
    }

    // delete the manifest file too
    if (await fileExists(manifestFileName)) {
        console.log(`deleting ${manifestFileName}`);
        await unlink(manifestFileName);
    }

    console.log("files restored");
};

module.exports = restore;