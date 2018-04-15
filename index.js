const fs = require("fs");
const md5File = require("md5-file/promise");
const manifestEntry = require("./lib/manifest");

const files = ["package.json:1:."];

manifestEntry(files[0]);

console.log("processing completed");