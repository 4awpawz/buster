"use strict";
const init = require("./init");
const bust = require("./bust");

const manifestFactory = async (ods, opt) => {
    const manifest = await init(ods);
    await bust(manifest, opt);
};

module.exports = manifestFactory;
