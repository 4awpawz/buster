const init = require("./init");
const restore = require("./restore");
const bust = require("./bust");

const manifest = [];

const manifestFactory = () => async (opDirs, opt) => {
    // initalize the manifest
    await init(manifest, opDirs);

    if (opt.restore) {
        await restore(manifest, opDirs, opt);
    } else {
        await bust(manifest, opDirs, opt);
    }
};

module.exports = manifestFactory;
