const md5File = require("md5-file/promise");

const hashFileName = (file) => {
    return md5File(file);
}

module.exports = hashFileName;
