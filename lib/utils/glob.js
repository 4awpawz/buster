const util = require("util");
module.exports = util.promisify(require("glob"));
