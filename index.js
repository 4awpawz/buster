const configFactory = require("./lib/config");
const manifestFactory = require("./lib/manifest");
const expandOds = require("./lib/ods");

const processBuster = async (paramsConfig = {}) => {
    const config = await configFactory(paramsConfig);
    const expandedOds = await expandOds(config.directives);

    console.log("processing started");

    await manifestFactory(expandedOds, config.options);

    console.log("processing completed");
};

module.exports = processBuster;