const fs = require("fs");
const manifestFactory = require("./lib/manifest");

// a mock for a config, a package.json hash or command line arguments
const directives = [
    "test-project/index.html:2:test-project",
    "test-project/script/test.js:1:test-project",
    "test-project/media/alphabet-arts-and-crafts-blog-459688.jpg:1:test-project",
    "test-project/css/test.css:3:test-project"
];

const process = () => {
    console.log("processing started");
    manifestFactory()(directives);
    console.log("processing completed");
};

// it all starts here
process();
