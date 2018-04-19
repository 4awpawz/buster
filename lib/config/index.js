const fs = require("fs");
const fileExist = require("file-exists");

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

    const pjConfig = readConfig("package.json");
    const busterConfig = readConfig("buster.json");
    const defaultConfig = { directives: [], options: { restore: false, manifest: "manifest.json" } };
    const configuration = { ...defaultConfig, ...pjConfig, ...busterConfig };

    console.log("configuration", configuration);

    return configuration;
};

module.exports = config;