"use strict";
const readFile = require("../utils/readFile");
const getCLArgs = require("../utils/getCLArgs");
const log = require("../utils/log");

const readConfig = async file => {
    let read;
    let parsed;

    read = await readFile(file, { encoding: "utf8" })
        .catch(e => {
            return false;
        });

    if (!read) {
        return {};
    }

    log(`file ${file} exists!`);

    parsed = JSON.parse(read);

    // package.json || .buster.json
    return parsed.buster
        ? parsed.buster
        : parsed;
};

const mergeConfigs = (conf1, conf2) => ({ ...conf1, ...conf2 });

const isConfigComplete = config => {
    return config.command === "bust" &&
        config.directives &&
        config.directives.length > 0 &&
        config.options ||
        config.command === "restore" &&
        config.directives &&
        config.directives.length > 0 &&
        config.options;
};

const setEnv = verbose => {
    process.env.BUSTERVERBOSE = verbose
        ? "verbose"
        : "quiet";
};

const config = async (paramsConfig) => {
    const defConfig = {
        command: "",
        options: {
            ignore: "",
            manifest: false,
            safeMode: false,
            verbose: false
        },
        directives: []
    };

    log("processing configuration");

    if (paramsConfig) {
        if (isConfigComplete(mergeConfigs(defConfig, paramsConfig))) {
            log("using params configuration");
            setEnv(mergeConfigs(defConfig, paramsConfig).options.verbose);
            return mergeConfigs(defConfig, paramsConfig);
        }
    } else {
        const clConfig = await getCLArgs();
        if (isConfigComplete(mergeConfigs(defConfig, clConfig))) {
            log("using command line configuration");
            setEnv(mergeConfigs(defConfig, clConfig).options.verbose);
            return mergeConfigs(defConfig, clConfig);
        }
        const busterConfig = await readConfig(".buster.json");
        if (isConfigComplete(mergeConfigs(mergeConfigs(defConfig, clConfig), busterConfig))) {
            log("using buster.json configuration");
            setEnv(mergeConfigs(mergeConfigs(defConfig, clConfig), busterConfig).options.verbose);
            return mergeConfigs(mergeConfigs(defConfig, clConfig), busterConfig);
        }
        const pjConfig = await readConfig("package.json");
        if (isConfigComplete(mergeConfigs(mergeConfigs(defConfig, clConfig), pjConfig))) {
            log("using package.json configuration");
            setEnv(mergeConfigs(mergeConfigs(defConfig, clConfig), pjConfig).options.verbose);
            return mergeConfigs(mergeConfigs(defConfig, clConfig), pjConfig);
        }
    }

    throw new Error("error: no valid configuration found");
};

module.exports = config;