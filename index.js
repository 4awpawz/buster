"use strict";
const configFactory = require("./lib/config");
const manifestFactory = require("./lib/manifest");
const expandOds = require("./lib/ods");
const log = require("./lib/utils/log");

/**
 * This is the main entry point to Buster processing. It is called by either the CLI or from a user script.
 * @param {object} paramsConfig - Only passed when processBuster is called from a user script and contains
 * the configuration properties required to run Buster.
 */
module.exports = async (paramsConfig) => {
    const config = await configFactory(paramsConfig);
    const expandedOds = await expandOds(config.directives, config.options.ignore);

    log("processing started");

    await manifestFactory(expandedOds, config.options);

    log("processing completed");
};