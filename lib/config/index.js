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

const readConfig = file => {
    var read;
    var parsed;

    if (!fileExist.sync(file)) {
        console.log(`file ${file} doesn't exist`);
        return {};
    }

    read = fs.readFileSync(file, { encoding: "utf8" });

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

const isConfigValid = config => config.directives.length && config.options;

const config = () => {
    console.log("processing configuration");

    const defConfig = {
        options: {
            manifest: false,
            restore: false
        },
        directives: []
    };
    const clConfig = readCLArgs();
    const busterConfig = readConfig(".buster.json");
    const pjConfig = readConfig("package.json");

    if (isConfigValid(mergeConfigs(defConfig, clConfig))) {
        console.log("using command line configuration");
        return mergeConfigs(defConfig, clConfig);
    }

    if (isConfigValid(mergeConfigs(mergeConfigs(defConfig, clConfig), busterConfig))) {
        console.log("using buster.json configuration");
        return mergeConfigs(mergeConfigs(defConfig, clConfig), busterConfig);
    }

    if (isConfigValid(mergeConfigs(mergeConfigs(defConfig, clConfig), pjConfig))) {
        console.log("using package.json. configuration");
        return mergeConfigs(mergeConfigs(defConfig, clConfig), pjConfig);
    }
};

module.exports = config;