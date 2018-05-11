const init = require("./init");
const restore = require("./restore");
const bust = require("./bust");

const manifestFactory = async (command, opDirs, opt) => {
    const manifest = await init(opDirs);

    if (command === "bust") {
        await bust(manifest, opDirs, opt);
    } else {
        await restore(manifest, opDirs, opt);
    }
};

module.exports = manifestFactory;
