const fs = require("fs");
const fileExist = require("file-exists");
const program = require("commander");
const mergeObjects = require("../utils/mergeObjects");

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
        console.log("terminating process");
        process.exit();
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

const configFactory = (defaultConfig, ...users) => {
    const mergeWithDefConf = mergeObjects(defaultConfig);

    for (var i = 0; i < users.length; i++) {
        const conf = mergeWithDefConf(users[i]);
        if (conf.directives.length) {
            return conf;
        }
    }

    console.log("configuration contains no operational directives");
    console.log("terminating process");
    process.exit();
};

const config = () => {
    console.log("processing user configuration");

    const clConfig = readCLArgs();
    const pjConfig = readConfig("package.json");
    const busterConfig = readConfig(".buster.json");
    const defConf = {
        options: {
            manifestDest: "manifest.json",
            restore: false
        },
        directives: []
    };

    return configFactory({ ...defConf, ...clConfig }, busterConfig, pjConfig);
};

module.exports = config;