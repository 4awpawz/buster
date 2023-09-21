/**
 * This module is responsible for creating the hashes used to rename files.
 * This module replaces md5-file in versions prior to v1.1.0
 */

"use strict";
const { createHash } = require("node:crypto");

module.exports = content => {
    const hash = createHash("md5");
    hash.update(content);
    const result = hash.digest("hex");
    return result;
};
