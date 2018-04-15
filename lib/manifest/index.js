const path = require("path");
const fileExists = require("file-exists");
const checkRange = require("../utils").checkRange;

const manifest = [];

const rangeIsValid = value => checkRange(value, 1, 3);

const manifestEntry = directive => {
    var parts = directive.split(":");
    var exists = false;
    var entry = {};

    // validate source
    exists = fileExists.sync(path.resolve(parts[0]));
    if (!exists) {
        console.log(`source file "${parts[0]}" doesn't exist`);
        console.log("terminating process");
        process.exit();
    } else {
        entry.source = path.resolve(parts[0]);
    }
    // validate directive
    if (!rangeIsValid(parts[1])) {
        console.log(`source file's directive "${parts[1]}" is invalid`);
        console.log("terminating process");
        process.exit();
    } else {
        entry.operation = parts[1];
    }
    // validate destination
    exists = path.resolve(parts[2]);
    if (!exists) {
        console.log(`destingation "${parts[2]}" doesn't exist`);
        console.log("terminating process");
        process.exit();
    } else {
        entry.dest = path.resolve(parts[2]);
    }
    // add entry to manifest
    manifest.push(entry);
};

const manifestFactory = directives => {
    directives.forEach(directive => manifestEntry(directive));
    console.log("operational directives validated");
    return manifest.length;
};

module.exports = manifestFactory;
