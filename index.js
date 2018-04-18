const path = require("path");
const manifestFactory = require("./lib/manifest");
const userPkgJson = require(path.join(process.cwd(), "package.json"));

// a mock for a config, a package.json hash or command line arguments
// const directives = [
//     "test-project/media/alphabet-arts-and-crafts-blog-459688-worked.jpg:1:test-project/media",
//     "test-project/media/black-and-white-close-up-cobweb-worked.jpg:1:test-project/media",
//     "test-project/media/cyclone-roller-coaster-coney-island-worked.jpg:1:test-project/media",
//     "test-project/media/tatoo-handshake-worked.jpg:1:test-project/media",
//     "test-project/index.html:2:test-project",
//     "test-project/css/test.css:3:test-project/css",
//     "test-project/script/test.js:3:test-project/script"
// ];

// const config = {
//     directives: directives,
//     options: {
//         // where to save the manifest, defaults to cwd
//         manifestDest: "./manifest.json",
//         // rename backup files  and delete generated hash files
//         restore: true,
//         // dry run only
//         dryRun: false
//     }
// };

const processBuster = (userPkgJson) => {
    console.log("processing started");
    // manifestFactory()(config.directives, config.options);
    manifestFactory()(userPkgJson.buster.directives, userPkgJson.buster.options);
    console.log("processing completed");
};

// it all starts here
console.log(userPkgJson);
processBuster(userPkgJson);
