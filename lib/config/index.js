const fileExists = require("file-exists");
const readFile = require("../utils/readFile");
const program = require("commander");

const readCLArgs = () => {
    const opts = ["ignore", "manifest", "restore"];

    program
        .version("0.0.1", "-v, --version")
        .usage("buster [options] [operational-directive...]")
        .option("-i, --ignore [ignore]", "A list of files to ignore; comma separated, no spaces")
        .option("-m, --manifest [manifest]", "Save manifest.json")
        .option("-r, --restore [restore]", "Restore touched files")
        .option("-d, --opDirs [opDirs]", "A list of operational directives; comma separated, no spaces")
        .parse(process.argv);

    const config = opts.filter(opt => program[opt]).reduce((acum, current) => {
        acum.options = acum.options || {};
        acum.options[current] = program[current];
        return acum;
    }, {});

    if (program.opDirs && program.opDirs.length) {
        config.directives = program.opDirs.split(",");
    }

    return config;
};

const readConfig = async file => {
    var read;
    var parsed;

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

const isConfigComplete = config => config.directives.length && config.options;

const config = async (paramsConfig) => {
    const defConfig = {
        options: {
            ignore: "",
            manifest: false,
            restore: false
        },
        directives: []
    };
    const clConfig = readCLArgs();
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

    throw "error: no valid configuration found";
};

module.exports = config;