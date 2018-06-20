const init = require("./init");
const restore = require("./restore");
const bust = require("./bust");
const log = require("../utils/log");

const manifestFactory = async (command, ods, opt) => {
    const manifest = await init(ods, command);

    if (command === "bust") {
        await bust(manifest, ods, opt);
    } else {
        if (!opt.safeMode) {
            for (const m of manifest) {
                log("manifest entry", m);
            }
            await restore(manifest, ods, opt);
        } else {
            console.log("restore isn't supported in safe mode");
        }
    }
};

module.exports = manifestFactory;
