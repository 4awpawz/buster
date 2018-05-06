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

const expandSource = async source => expandGlob(source);

const expandOds = async ods => {
    var newOds = [];
    var files;

    for (const od of ods) {
        console.log("process.cwd()", process.cwd());
        files = await expandSource(od.split(":")[0]);
        // newOds.push(filesToOds(files, od));
        newOds = [...newOds, ...filesToOds(files, od)];
    }

    return newOds;
};

module.exports = expandOds;