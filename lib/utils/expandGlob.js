const util = require("util");
const glob = require("glob");
const dedupe = require("./dedupe");

const globPromise = util.promisify(glob);

const getFiles = async (patterns, options = {}) => {
    var files;
    var setOfFiles = new Set();

    for (const ptrn of patterns) {
        files = await globPromise(ptrn, options);
        setOfFiles = dedupe(setOfFiles, files);
    }

    return Array.from(setOfFiles);
};

const makeOptionsObj = ignore => {
    const ign = {};

    if (ignore.length) {
        ign.ignore = ignore.split(",").map(i => i.trim());
    }

    return ign;
};

const makeGlobsAr = globs => globs.split(",").map(glb => glb.trim());

const doit = async (globs, ignore = "") => {
    var files;

    try {
        const opts = makeOptionsObj(ignore);
        console.log("options", opts);

        const glbs = makeGlobsAr(globs);
        console.log("globs", glbs);

        files = await getFiles(glbs, opts);
        console.log("files", files);

        console.log("done");

        return files;
    } catch (e) {
        console.log("error", e);
    }
};

const expandGlob = async (glob, ignores) => {
    const result = await doit(glob, ignores);
    console.log("done!!!!");
    return result;
};

module.exports = expandGlob;