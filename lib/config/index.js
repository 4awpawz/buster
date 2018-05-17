const fileExists = require("file-exists");
const readFile = require("../utils/readFile");
const getCLArgs = require("../utils/getCLArgs");
const log = require("../utils/log");

const readConfig = async file => {
    let read;
    let parsed;

    if (await !fileExists(file)) {
        log(`file ${file} doesn't exist`);
        return {};
    }

    read = await readFile(file, { encoding: "utf8" });
    if (!read || !read.length) {
        return {};
    }
    parsed = JSON.parse(read);

    // package.json || .buster.json
    return parsed.buster
        ? parsed.buster
        : parsed;
};

const mergeConfigs = (conf1, conf2) => ({ ...conf1, ...conf2 });

const isConfigComplete = config => config.command.length && config.command === "bust" || config.command === "restore" && config.directives.length && config.options;

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
            verbose: false
        },
        directives: []
    };
    const clConfig = await getCLArgs();
    const busterConfig = await readConfig(".buster.json");
    const pjConfig = await readConfig("package.json");

    log("processing configuration");

    if (isConfigComplete(mergeConfigs(defConfig, clConfig))) {
        console.log("using command line configuration");
        setEnv(mergeConfigs(defConfig, clConfig).options.verbose);
        return mergeConfigs(defConfig, clConfig);
    }

    if (isConfigComplete(mergeConfigs(mergeConfigs(defConfig, clConfig), paramsConfig))) {
        console.log("using params configuration");
        setEnv(mergeConfigs(mergeConfigs(defConfig, clConfig), paramsConfig).options.verbose);
        return mergeConfigs(mergeConfigs(mergeConfigs(defConfig, clConfig), paramsConfig));
    }

    if (isConfigComplete(mergeConfigs(mergeConfigs(defConfig, clConfig), busterConfig))) {
        console.log("using buster.json configuration");
        setEnv(mergeConfigs(mergeConfigs(defConfig, clConfig), busterConfig).options.verbose);
        return mergeConfigs(mergeConfigs(defConfig, clConfig), busterConfig);
    }

    if (isConfigComplete(mergeConfigs(mergeConfigs(defConfig, clConfig), pjConfig))) {
        console.log("using package.json. configuration");
        setEnv(mergeConfigs(mergeConfigs(defConfig, clConfig), pjConfig).options.verbose);
        return mergeConfigs(mergeConfigs(defConfig, clConfig), pjConfig);
    }

    throw new Error("error: no valid configuration found");
};

module.exports = config;