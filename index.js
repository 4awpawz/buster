const configFactory = require("./lib/config");
const manifestFactory = require("./lib/manifest");
const expandOds = require("./lib/ods");

const processBuster = async (paramsConfig = {}) => {
    const config = await configFactory(paramsConfig);
    var expandedOds;

    console.log("processing started");

    if (!config) {
        console.log("no valid configuration found");
        console.log("terminating process");
        process.exit();
    }

    expandedOds = await expandOds(config.directives);
    console.log("expandedOds", expandedOds);

    // await manifestFactory()(config.directives, config.options);
    await manifestFactory()(expandedOds, config.options);

    console.log("processing completed");
};

module.exports = processBuster;