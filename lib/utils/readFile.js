const util = require("util");
const fs = require("fs");

module.exports = util.promisify(fs.readFile);