const md5File = require("md5-file");

const hashFileName = (file) => {
    return md5File.sync(file);
};

module.exports = hashFileName;
