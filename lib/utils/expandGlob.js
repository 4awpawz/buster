const glob = require("./glob");
const dedupe = require("./dedupe");

const getFiles = async (patterns, options = {}) => {
    let files;
    let setOfFiles = new Set();

    for (const ptrn of patterns) {
        files = await glob(ptrn, options);
        setOfFiles = dedupe(setOfFiles, files);
    }

    return Array.from(setOfFiles);
};

const makeGlobsAr = globs => globs.split(",").map(glb => glb.trim());

const makeOptionsObj = ignore => ignore.length
    ? { ignore: ignore.split(",").map(i => i.trim()) }
    : {};

const doit = async (globs, ignore = "") => {
    const opts = makeOptionsObj(ignore);
    const glbs = makeGlobsAr(globs);
    return getFiles(glbs, opts);
};

const expandGlob = async (glob, ignores) => doit(glob, ignores);

module.exports = expandGlob;