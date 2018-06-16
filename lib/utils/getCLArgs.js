const program = require("commander");

const getCLArgs = () => {
    return new Promise((resolve, reject) => {
        // if no command line input then there's nothing to do
        if (process.argv.length === 2) {
            resolve({});
        } else {
            program
                .version("0.0.1")
                .usage("<bust | restore> [options] <ods ...>")
                .option("-i, --ignore [ignore]", "a \"quoted\" string of one or more files to ignore")
                .option("-m, --manifest", "save manifest to file when cache busting")
                .option("-v, --verbose", "chatty mode - provides more detailed loging");

            program
                .command("bust [ods]")
                .description("cache bust files")
                .action(function (ods, cmd) {
                    resolve({
                        command: "bust",
                        directives: ods && ods.length && ods.split(","),
                        options: {
                            ignore: cmd.parent.ignore,
                            manifest: cmd.parent.manifest,
                            verbose: cmd.parent.verbose
                        }
                    });
                });

            program
                .command("restore [ods]")
                .description("restore files")
                .action(function (ods, cmd) {
                    resolve({
                        command: "restore",
                        directives: ods && ods.length && ods.split(","),
                        options: {
                            ignore: cmd.parent.ignore,
                            verbose: cmd.parent.verbose
                        }
                    });
                });

            const clHelp = () => {
                console.log("");
                console.log("  See https://github.com/4awpawz/buster/#readme for specific details");
                console.log("");
            };

            program.on("--help", clHelp);

            program.parse(process.argv);
        }
    });
};

module.exports = getCLArgs;