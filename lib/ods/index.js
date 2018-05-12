const expandGlob = require("../utils/expandGlob");
const path = require("path");

const filesToOds = (files, odAr) =>
    files.map(file => `${file}:${odAr[1]}:${resolveDest(odAr[2], file)}`);

const resolveDest = (dest, file) => {
    const dirName = path.dirname(file);
    var pathParts;
    var newPath;

    // if = then nothing to do
    if (dirName === dest) {
        return dest;
    }

    // normalize dest path
    pathParts = path.dirname(file).split(path.sep);
    pathParts[0] = dest;
    newPath = path.join(...pathParts);
    // newPath = path.format({ dir: newPath, name: path.basename(f) });
    // console.log("newPath", newPath);
    return newPath;
};

const expandOds = async (ods, ignore) => {
    var newOds = [];

    for (const od of ods) {
        const odParts = od.split(":");
        const files = await expandGlob(odParts[0], ignore);
        newOds = [...newOds, ...filesToOds(files, odParts)];
    }

    return newOds;
};

module.exports = expandOds;