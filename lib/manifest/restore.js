const path = require("path");
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
        await unlink(`${item.dest}${path.sep}${item.hashFileName}`)
            .catch(e => log(`file ${item.dest}${path.sep}${item.hashFileName} not found for deletion`));
    }

    // od 2 - delete the created file and rename the backup file
    log("restoring original files from backups");
    filtered = manifest.filter(item => item.operation === 2);
    for (const item of filtered) {
        if (path.dirname(item.source) === path.normalize(item.dest)) {
            await unlink(item.source)
                .catch(e => log(`file ${item.source} not found for deletion`));
            await rename(`${item.dest}${path.sep}${item.backupFileName}`, item.source)
                .catch(e => log(`file ${item.dest}${path.sep}${item.backupFileName} not found for renaming`));
        } else {
            await unlink(`${item.dest}${path.sep}${path.basename(item.source)}`)
                .catch(e => log(`file ${item.dest}${path.sep}${path.basename(item.source)} not found for deletion`));
        }
    }

    // delete the manifest file too
    log(`deleting ${manifestFileName}`);
    await unlink(manifestFileName)
        .catch(e => log(`file ${manifestFileName} not found for deletion`));

    console.log("files restored");
};

module.exports = restore;