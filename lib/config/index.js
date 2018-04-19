const fs = require("fs");
const fileExist = require("file-exists");

const readConfig = file => {
    var read;
    var parsed;
    if (fileExist.sync(file)) {
        read = fs.readFileSync(file, { encoding: "utf8" });
    }
    if (read && read.length) {
        parsed = JSON.parse(read);
        if (parsed.buster) {
            return parsed.buster;
        }
    }
    return {};
};

const config = () => {
    console.log("processing user configuration");

    const pjConfig = readConfig("package.json");
    const busterConfig = readConfig("buster.json");
    const configuration = { ...pjConfig, ...busterConfig };
    console.log("configuration", configuration);
    return configuration;
};

module.exports = config;