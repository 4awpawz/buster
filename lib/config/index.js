const fs = require("fs");
const fileExist = require("file-exists");
const program = require("commander");

const readCLArgs = () => {
    var config = {};

    program
        .version("0.0.1")
        .usage("buster [options] [operational-directive...]")
        .option("-m, --manifest [manifest]", "Save manifest")
        .option("-r, --restore", "Restore touched files")
        .option("-d, --opDirs [opDirs]", "A list of operational directives; comma separate, no spaces")
        .parse(process.argv);

    if (program.manifest) {
        config.options = config.options || {};
        config.options.manifest = program.manifest;
    }

    if (program.restore) {
        config.options = config.options || {};
        config.options.restore = program.restore;
    }

    if (program.opDirs) {
        config.directives = program.opDirs.split(",");
    }

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
        // package.json || buster.json
        config = parsed.buster ? parsed.buster : parsed;
    }

    return config;
};

const config = () => {
    console.log("processing user configuration");

    const clConfig = readCLArgs();
    const pjConfig = readConfig("package.json");
    const busterConfig = readConfig("buster.json");
    const defaultConfig = { directives: [], options: { restore: false, manifest: "manifest.json" } };
    const configuration = { ...defaultConfig, ...pjConfig, ...busterConfig, ...clConfig };

    return configuration;
};

module.exports = config;