const expandGlob = require("../utils/expandGlob");
const path = require("path");

const filesToOds = (expandedFilePaths, odAr) =>
    expandedFilePaths.map(expandedFilePath =>
        `${expandedFilePath}:${odAr[1]}:${resolveDest(odAr[0], odAr[2], expandedFilePath)}`);

const resolveDest = (odInput, dest, file) => {
    const odInputSegs = odInput.split(path.sep);
    const fileSegs = path.dirname(file).split(path.sep);
    let newPath;
    for (let x = 0; x < odInputSegs.length; x++) {
        if (fileSegs[x] !== odInputSegs[x]) {
            newPath = fileSegs.slice(x).join(path.sep);
            break;
        }
    }
    newPath = `${dest}${path.sep}${newPath}`;
    newPath = newPath[newPath.length - 1] === path.sep
        ? newPath.substring(0, newPath.length - 1)
        : newPath;
    return newPath;
};

const expandOds = async (ods, ignore) => {
    let newOds = [];

    for (const od of ods) {
        const odParts = od.split(":");
        const files = await expandGlob(odParts[0], ignore);
        newOds = [...newOds, ...filesToOds(files, odParts)];
    }

    return newOds;
};

module.exports = expandOds;