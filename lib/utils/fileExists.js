const util = require("util");
const fileExist = require("file-exists");

module.exports = util.promisify(fileExist);