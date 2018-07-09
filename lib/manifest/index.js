const init = require("./init");
const restore = require("./restore");
const bust = require("./bust");

const manifestFactory = async (command, ods, opt) => {
    const manifest = await init(ods, command);

    if (command === "bust") {
        await bust(manifest, ods, opt);
    } else {
        if (!opt.safeMode) {
            await restore(manifest, ods, opt);
        } else {
            console.log("safe mode doesn't support restore");
        }
    }
};

module.exports = manifestFactory;
