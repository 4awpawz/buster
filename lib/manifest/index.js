const init = require("./init");
const restore = require("./restore");
const bust = require("./bust");

const manifest = [];

const manifestFactory = () => (opDirs, opt) => {
    // initalize the manifest
    init(manifest, opDirs);

    if (opt.restore) {
        restore(manifest, opDirs, opt);
    } else {
        bust(manifest, opDirs, opt);
    }
};

module.exports = manifestFactory;
