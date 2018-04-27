const util = require("util");
const fs = require("fs");
const fileExist = require("file-exists");
const program = require("commander");

const readCLArgs = () => {
    const config = {};

    program
        .version("0.0.1", "-v, --version")
        .usage("buster [options] [operational-directive...]")
        .option("-m, --manifest [manifest]", "Save manifest.json")
        .option("-r, --restore [restore]", "Restore touched files")
        .option("-d, --opDirs [opDirs]", "A list of operational directives; comma separated, no spaces")
        .parse(process.argv);

    if (program.manifest) {
        config.options = config.options || {};
        config.options.manifest = program.manifest;
    }

    if (program.restore) {
        config.options = config.options || {};
        config.options.restore = program.restore;
    }

    if (program.opDirs && program.opDirs.length) {
        config.directives = program.opDirs.split(",");
    }

    return config;
};

const readConfig = async file => {
    const fileExistsP = util.promisify(fileExist);
    const readFileP = util.promisify(fs.readFile);
    var read;
    var parsed;

    if (await !fileExistsP(file)) {
        console.log(`file ${file} doesn't exist`);
        return {};
    }

    read = await readFileP(file, { encoding: "utf8" });

    if (!read || !read.length) {
        return {};
    }

    try {
        parsed = JSON.parse(read);
    } catch (error) {
        console.log(`syntax error parsing ${file}`);
        console.log("terminating process");
        process.exit();
    }

    // package.json || .buster.json
    return parsed.buster ? parsed.buster : parsed;
};

const mergeConfigs = (conf1, conf2) => ({ ...conf1, ...conf2 });

const isConfigComplete = config => config.directives.length && config.options;

const config = async (paramsConfig) => {
    console.log("processing configuration");

    const defConfig = {
        options: {
            manifest: false,
            restore: false
        },
        directives: []
    };
    const clConfig = readCLArgs();
    const busterConfig = await readConfig(".buster.json");
    const pjConfig = await readConfig("package.json");

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
};

module.exports = config;