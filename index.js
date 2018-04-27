const configFactory = require("./lib/config");
const manifestFactory = require("./lib/manifest");

const processBuster = async (paramsConfig = {}) => {
    const config = await configFactory(paramsConfig);

    console.log("processing started");

    if (!config) {
        console.log("no valid configuration found");
        console.log("terminating process");
        process.exit();
    }

    manifestFactory()(config.directives, config.options);

    console.log("processing completed");
};

module.exports = processBuster;