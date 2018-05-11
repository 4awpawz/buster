const expandGlob = require("../utils/expandGlob");

const filesToOds = (files, odAr) => files.map(file => `${file}:${odAr[1]}:${odAr[2]}`);

const expandOds = async (ods, ignore) => {
    var newOds = [];

    for (const od of ods) {
        const files = await expandGlob(od.split(":")[0], ignore);
        newOds = [...newOds, ...filesToOds(files, od.split(":"))];
    }

    return newOds;
};

module.exports = expandOds;