"use strict";
const { dedupe, expandGlob } = require("../utils");

const filesToOds = (filePaths, odAr) =>
    filePaths.map(filePath => {
        return `${filePath}:${odAr[1]}`;
    });

/**
 * This module generates one or more operational directives for actual files
 * from the globs found in the original operational directives that were passed in config.directives.
 * @param {array} ods - The operational directives that were passed in config.directives.
 * @param {string} ignore - The config.options.ignore property which contains a comma separated list of files to ignore.
 */
module.exports = async (ods, ignore) => {
    const newOds = [];

    for (const od of ods) {
        const odParts = od.split(":");
        const files = await expandGlob(odParts[0], ignore);
        newOds.push(...filesToOds(files, odParts));
    }

    return dedupe(newOds);
};