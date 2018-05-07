const expandGlob = require("../utils/expandGlob");

const odPartsToOd = (source, operation, destination) =>
    `${source}:${operation}:${destination}`;

const filesToOds = (files, od) => {
    const odParts = od.split(":");
    const operation = odParts[1];
    const dest = odParts[2];
    var ods = [];

    for (const file of files) {
        ods.push(odPartsToOd(file, operation, dest));
    }
    return ods;
};

const expandOds = async (ods, ignore) => {
    var newOds = [];
    var files;

    for (const od of ods) {
        files = await expandGlob(od.split(":")[0], ignore);
        newOds = [...newOds, ...filesToOds(files, od)];
    }

    return newOds;
};

module.exports = expandOds;