const util = require("util");
const md5File = require("md5-file");

const md5FileP = util.promisify(md5File);

const hashFileName = (file) => {
    return md5FileP(file);
};

module.exports = hashFileName;
