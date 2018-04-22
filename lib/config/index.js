const fs = require("fs");
const fileExist = require("file-exists");
const program = require("commander");
const mergeObjects = require("../utils/mergeObjects");

const readCLArgs = () => {
    var config = { options: {}, directives: [] };

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
    var config = {};

    if (fileExist.sync(file)) {
        read = fs.readFileSync(file, { encoding: "utf8" });
    }

    if (read && read.length) {
        try {
            parsed = JSON.parse(read);
        } catch (error) {
            console.log(`syntax error parsing ${file}`);
            process.exit();
        }
        // package.json || .buster.json
        config = parsed.buster ? parsed.buster : parsed;
    }

    return config;
};

const configFactory = (defaultConfig, ...users) => {
    var mergeWithDefConf = mergeObjects(defaultConfig);
    var conf;
    for (var i = 0; i < users.length; i++) {
        conf = mergeWithDefConf(users[i]);
        if (conf.directives.length) {
            break;
        }
    }
    return conf;
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
    const config = configFactory({ ...defConf, ...clConfig }, busterConfig, pjConfig);

    return config;
};

module.exports = config;