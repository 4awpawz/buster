"use strict";
const glob = require("./glob");

const getFiles = async (patterns, options = {}) => {
    const files = [];
    for (const ptrn of patterns) {
        const expamdedFiles = await glob(ptrn, options);
        files.push(...expamdedFiles);
    }
    return files;
};

const makeGlobsAr = globs => globs.split(",").map(glb => glb.trim());

const makeOptionsObj = ignore => ignore.length
    ? { ignore: ignore.split(",").map(i => i.trim()) }
    : {};

module.exports = async (globs, ignore = "") => {
    const opts = makeOptionsObj(ignore);
    const glbs = makeGlobsAr(globs);
    return getFiles(glbs, opts);
};
