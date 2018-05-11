const program = require("commander");

const getCLArgs = () => {
    return new Promise((resolve, reject) => {
        program
            .version("0.0.1")
            .usage("<bust | restore> [options] <files ...>")
            .option("-i, --ignore [ignore]", "one ore more files to ignore")
            .option("-m, --manifest", "save manifest to file when cache busting");

        program
            .command("bust [files]")
            .description("one or more files to cache bust")
            .action(function (files, cmd) {
                console.log("command", "bust");
                console.log("files", files);
                console.log("cmd -i", cmd.parent.ignore);
                console.log("cmd -m", cmd.paroent.manifest);
                resolve({
                    command: "bust",
                    files,
                    options: {
                        ignore: cmd.parent.ignore,
                        manifest: cmd.parent.manifest
                    }
                });
            });

        program
            .command("restore [files]")
            .description("restore files from cache bust")
            .action(function (files, cmd) {
                console.log("command", "restore");
                console.log("files", files);
                console.log("cmd -i", cmd.parent.ignore);
                console.log("cmd -m", cmd.parent.manifest);
                resolve({
                    command: "restore",
                    files,
                    options: {
                        ignore: cmd.parent.ignore
                    }
                });
            });

        const clHelp = () => {
            console.log("");
            console.log("  See buster documentation for specific details");
            console.log("");
        };

        program.on("--help", clHelp);

        program.parse(process.argv);
    });
};

module.exports = getCLArgs;