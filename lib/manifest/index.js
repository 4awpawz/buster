const init = require("./init");
const restore = require("./restore");
const bust = require("./bust");

const manifestFactory = async (opDirs, opt) => {
    const manifest = await init(opDirs);

    if (opt.restore) {
        await restore(manifest, opDirs, opt);
    } else {
        await bust(manifest, opDirs, opt);
    }
};

module.exports = manifestFactory;
