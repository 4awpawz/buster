"use strict";
const readFile = require("../utils/readFile");
const log = require("../utils/log");

const readConfig = async file => {
    const read = await readFile(file, { encoding: "utf8" })
        .catch(e => {
            return false;
        });

    if (!read) {
        return {};
    }

    log(`file ${file} exists!`);

    return JSON.parse(read);
};

const mergeConfigs = (conf1, conf2) => ({ ...conf1, ...conf2 });

const isConfigComplete = config => {
    return config.directives && config.directives.length > 0 && config.options;
};

const setEnv = verbose => {
    process.env.BUSTERVERBOSE = verbose ? "verbose" : "quiet";
};

/**
 * This module is responsible for validating the configuration properties which can be passed from a
 * user script as paramsConfig or from .buster.json when Buster is called from the command line.
 * @param {object} paramsConfig - Only passed when processBuster is called from a user script and contains
 * the configuration properties required to run Buster.
 */
module.exports = async (paramsConfig) => {
    const defConfig = {
        options: {
            ignore: "",
            manifest: false,
            verbose: false
        },
        directives: []
    };

    log("processing configuration");

    if (paramsConfig) {
        // Buster is being called from a user script which is passing
        // configuration properties in paramsConfig.
        const config = mergeConfigs(defConfig, paramsConfig);
        if (isConfigComplete(config)) {
            log("using params configuration");
            setEnv(config.options.verbose);
            return config;
        }
    } else {
        // Buster is being called from the command line (see cli.js) and
        // will find its configuration properties in file .buster.json.
        const config = mergeConfigs(defConfig, await readConfig(".buster.json"));
        if (isConfigComplete(config)) {
            log("using .buster.json configuration");
            setEnv(config.options.verbose);
            return config;
        }
    }

    throw new Error("error: no valid configuration found");
};