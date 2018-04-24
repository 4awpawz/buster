const fs = require("fs");
const fileExist = require("file-exists");
const program = require("commander");

const readCLArgs = () => {
    const config = { options: {}, directives: [] };

    program
        .version("0.0.1")
        .usage("buster [options] [operational-directive...]")
        .option("-m, --manifest [manifest]", "path where manifest is saved to")
        .option("-r, --restore", "Restore touched files")
        .option("-d, --opDirs [opDirs]", "A list of operational directives; comma separated, no spaces")
        .parse(process.argv);

    config.options.manifestDest = program.manifest || config.options.manifestDest;
    config.options.restore = program.restore || config.options.restore;
    config.directives = program.opDirs && program.opDirs.length &&
        program.opDirs.split(",") || [];

    return config;
};

const readConfig = file => {
    var read;
    var parsed;

    if (!fileExist.sync(file)) {
        console.log(`file ${file} doesn't exist`);
        // console.log("terminating process");
        // process.exit();
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

const isConfigValid = config => (config.directives.length && config.options) &&
    (config.options.manifestDest || config.options.restore);

const config = () => {
    console.log("processing configuration");

    const defConfig = {
        options: {
            manifestDest: "manifest.json",
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