"use strict";
module.exports = require("util").promisify(require("fs").writeFile);