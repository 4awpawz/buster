const path = require("path");
const fileExists = require("file-exists");
const unlink = require("../utils/unlink");
const rename = require("../utils/rename");
const manifestFileName = require("./manifestFileName");
const log = require("../utils/log");

const restore = async (manifest) => {
    let filtered;

    log("restoring files");

    // od 1, od3 - delete the hashed files
    log("deleting hashed files");

    filtered = manifest.filter(item => item.operation === 1 || item.operation === 3);
    for (const item of filtered) {
        if (await fileExists(`${item.dest}${path.sep}${item.hashFileName}`)) {
            await unlink(`${item.dest}${path.sep}${item.hashFileName}`);
        }
    }

    // od 2 - delete the created file and rename the backup file
    log("restoring original files from backups");
    filtered = manifest.filter(item => item.operation === 2);
    for (const item of filtered) {
        if (path.dirname(item.source) === path.normalize(item.dest)) {
            if (await fileExists(item.source) && await fileExists(item.backupFileName)) {
                await unlink(item.source);
                await rename(item.backupFileName, item.source);
            }
        } else {
            if (await fileExists(`${item.dest}${path.sep}${path.basename(item.source)}`)) {
                await unlink(`${item.dest}${path.sep}${path.basename(item.source)}`);
            }
        }
    }

    // delete the manifest file too
    if (await fileExists(manifestFileName)) {
        log(`deleting ${manifestFileName}`);
        await unlink(manifestFileName);
    }

    console.log("files restored");
};

module.exports = restore;