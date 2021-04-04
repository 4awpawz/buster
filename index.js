"use strict";
const configFactory = require("./lib/config");
const manifestFactory = require("./lib/manifest");
const expandOds = require("./lib/ods");
const log = require("./lib/utils/log");

const processBuster = async (paramsConfig) => {
    const config = await configFactory(paramsConfig);
    const expandedOds = await expandOds(config.directives, config.options.ignore);

    log("processing started");

    await manifestFactory(config.command, expandedOds, config.options);

    log("processing completed");
};

module.exports = processBuster;