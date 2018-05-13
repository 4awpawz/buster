const fileExists = require("file-exists");
const readFile = require("../utils/readFile");
const getCLArgs = require("../utils/getCLArgs");

const readConfig = async file => {
    let read;
    let parsed;

    if (await !fileExists(file)) {
        console.log(`file ${file} doesn't exist`);
        return {};
    }

    read = await readFile(file, { encoding: "utf8" });
    if (!read || !read.length) {
        return {};
    }
    parsed = JSON.parse(read);

    // package.json || .buster.json
    return parsed.buster ? parsed.buster : parsed;
};

const mergeConfigs = (conf1, conf2) => ({ ...conf1, ...conf2 });

const isConfigComplete = config => config.command.length && config.command === "bust" || config.command === "restore" && config.directives.length && config.options;

const config = async (paramsConfig) => {
    const defConfig = {
        command: "",
        options: {
            ignore: "",
            manifest: false
        },
        directives: []
    };
    const clConfig = await getCLArgs();
    const busterConfig = await readConfig(".buster.json");
    const pjConfig = await readConfig("package.json");

    console.log("processing configuration");

    if (isConfigComplete(mergeConfigs(defConfig, clConfig))) {
        console.log("using command line configuration");
        return mergeConfigs(defConfig, clConfig);
    }

    if (isConfigComplete(mergeConfigs(mergeConfigs(defConfig, clConfig), paramsConfig))) {
        console.log("using params configuration");
        return mergeConfigs(mergeConfigs(mergeConfigs(defConfig, clConfig), paramsConfig));
    }

    if (isConfigComplete(mergeConfigs(mergeConfigs(defConfig, clConfig), busterConfig))) {
        console.log("using buster.json configuration");
        return mergeConfigs(mergeConfigs(defConfig, clConfig), busterConfig);
    }

    if (isConfigComplete(mergeConfigs(mergeConfigs(defConfig, clConfig), pjConfig))) {
        console.log("using package.json. configuration");
        return mergeConfigs(mergeConfigs(defConfig, clConfig), pjConfig);
    }

    throw new Error("error: no valid configuration found");
};

module.exports = config;