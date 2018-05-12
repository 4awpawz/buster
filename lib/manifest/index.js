const init = require("./init");
const restore = require("./restore");
const bust = require("./bust");

const manifestFactory = async (command, ods, opt) => {
    const manifest = await init(ods);

    if (command === "bust") {
        await bust(manifest, ods, opt);
    } else {
        await restore(manifest, ods, opt);
    }
};

module.exports = manifestFactory;
