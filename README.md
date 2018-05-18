# a cache buster called *Buster*
Buster busts your browser cache problems

## features

1. renames files using MD5 hash-based cache busting file names

1. cache bust in place or target a different folder

1. replaces references in files to original files names with their MD5 hash-based file names

1. outputs a manifest to buster.manifest.json

1. can restore your project back to its original state

1. configurable via the command line, .buster.json, package.json and your own scripts

1. scriptable and easily integrates into your projects and workflow


## installation
    # installing locally
    npm install --save-dev @4awpawz/buster
    
    # installing globally
    npm install -g @4awpawz/buster

## operational directives
Buster employs a concept called *Operational Directives*, abbreviated *ods*, to direct the operations it performs on files. Each operational directive is comprised of 3 parts, as in *'input:operation:output'*:

1. input - a relative path to one or more files. Supports *globs/wildcard* patterns.

2. operation - a number, surrounded by colons (e.g. ":1:"), in the range of 1 to 3, which is used to indicate the set of *actions* that Buster performs on the file(s) identified by item 1 above. The following 3 operations are currently supported:

    * :1: - Instructs Buster to create a copy of each input file using MD5 hash-based file names. The copied file's name will be *[original file name].[unique hash value].[original file type]* (e.g. `cat.[unique hash value].jpg`).

    * :2: - Instructs Buster to search each input file's content, replacing all references to file names with their corresponding hash-based file names. A backup of each input file is saved with a file name of *[original file name].buster-copy.[original file type]* (e.g. `./index.buster-copy.html`).

    * :3: - Instructs Buster to create a copy of each input file using a hash-based file name and to search each copied file's content, replacing all references to file names with their corresponding hash-based file names. The copied file's hash-based file name will be *[original file name].[unique hash value].[original file type]* (e.g. `app.[unique hash value].js`).

3. output - a relative path to where the output of the operation is to be saved. Supports *globs/wildcard* patterns.

>__Important__ Buster assumes that all relative paths are relative to `process.cwd()`.

__example__ operational directive:

    `media/housecat.jpg:1:media`

The above directs Buster to save a copy of *media/housecat.jpg* to the *media* folder with a hash-based file name (i.e. *media/housecat.[unique hash value].jpg*). 

The result of the above would be:

    |- media/
    |    | 
    |    |- housecat.jpg
    |    |- housecat.[unique hash name].jpg

__example__ operational directive using a glob:

    `media/**/*.jpg:1:staging/media`

The above directs Buster to recursively traverse all files and folders, starting from within the *media* folder, and to save a copy of each file that matches the *`*.jpg`* pattern to the *staging/media* folder with a hash-based file name.


>__Important__ When copying files, Buster will make folders and their parents if needed.

The result of the above would be:

    |- staging/    <-- created
    |    |
    |    |- media/    <-- created
    |        |
    |        |- housecat.[unique hash name].jpg
    |        |- purringcat.[unique hash name].jpg
    |        |- bigcats/    <-- created
    |            |
    |            |- lion.[unique hash name].jpg
    |            |- tiger.[unique hash name].jpg
    |- media/
    |    |
    |    |- housecat.jpg
    |    |- purringcat.jpg
    |    |- bigcats/
    |        |
    |        |- lion.jpg
    |        |- tiger.jpg

>__Important__ Buster implements its *glob* support using node package __glob__. Please refer to node package [*glob*](https://www.npmjs.com/package/glob) should you need additional information on using globs with Buster. 

## configuration

Buster builds its runtime configuration from the [sub commands](#sub-commands), [options](#options) and [operational directives](#operational-directives) it gets from the [command line](#command-line-configuration), from [another program](#calling-buster-programmatically), from [.buster.json](#busterjson-configuration) or from [package.json](#packagejson-configuration).

## sub commands
Buster has 2 sub commands:

### bust
`buster bust [options] <ods>`

Commands Buster to cache bust the files identified by the operational directives.

### restore
`buster restore [options] <ods>`

Commands Buster to restore the project back to its *original state*.

>__*Important*__ for *restore* to work, you must provide the same *ignored option files list* and the same *operational directives list* used to run the *bust* command.

## options
Buster supports the following options:

### ignore
`buster <sub command> [-i|--ignore] <'path/to/file[,path/to/file,...]'> <ods>`

Requires a *quoted* list of one or more comma separated *paths to files* to ignore.

Supports *globs* and *wildcard* characters patterns.

### manifest
`buster <bust> [-m|--manifest]`

Saves the manifest to *buster.manifest.json* in the project's *root folder*.

__sample__  buster.manifest.json file:
```
{
    "manifest": [
        {
            "source": "media/cyclone-roller-coaster-coney-island-worked.jpg",
            "operation": 1,
            "dest": "staging/media",
            "hashFileName": "cyclone-roller-coaster-coney-island-worked.0d5a7f4c21151797e98aa6cf76302f7f.jpg"
        },
        {
            "source": "media/sub/alphabet-arts-and-crafts-blog-459688-worked.jpg",
            "operation": 1,
            "dest": "staging/media/sub",
            "hashFileName": "alphabet-arts-and-crafts-blog-459688-worked.d9c0594248cfc285a062f74146b12232.jpg"
        },
        {
            "source": "media/sub/black-and-white-close-up-cobweb-worked.jpg",
            "operation": 1,
            "dest": "staging/media/sub",
            "hashFileName": "black-and-white-close-up-cobweb-worked.b10a846ff8428effe892c1f9b6a91680.jpg"
        },
        {
            "source": "media/tatoo-handshake-worked.jpg",
            "operation": 1,
            "dest": "staging/media",
            "hashFileName": "tatoo-handshake-worked.18267714b0e7f14d41e215354ddbf88a.jpg"
        },
        {
            "source": "./index.html",
            "operation": 2,
            "dest": "staging",
            "backupFileName": "./index.buster-copy.html"
        },
        {
            "source": "css/test.css",
            "operation": 3,
            "dest": "staging/css",
            "hashFileName": "test.8051095bd11b6e31145a8a3fd355d4c6.css"
        },
        {
            "source": "script/test.js",
            "operation": 3,
            "dest": "staging/script",
            "hashFileName": "test.e6187d98b7362765c69015d34f010dd2.js"
        }
    ]
}
```

### verbose
`buster <sub command> [-v|--verbose] <ods>`

Provides detailed logging

## command line configuration

At the command line type `buster -h`:

![screen shot 2018-05-15 at 9 22 19 am](https://user-images.githubusercontent.com/271288/40059607-74ecf2d8-5822-11e8-8d26-32d63c7849ff.png)

__examples:__

    $ buster bust media/meow.jpg:1:media/,./index.html:2:.,css/style.scss:3:css

    $ buster restore media/meow.jpg:1:media/,./index.html:2:.,css/style.scss:3:css

    $ buster bust -m -v media/**/*.jpg:1:media/,./index.html:2:.,css/style.scss:3:css

    $ buster restore -v media/**/*.jpg:1:media/,./index.html:2:.,css/style.scss:3:css

    $ buster bust -m -i 'media/original/**/*.jpg' media/**/*.jpg:1:staging/media/,./index.html:2:staging,css/style.scss:3:staging/css

    $ buster restore -i 'media/original/**/*.jpg' media/**/*.jpg:1:staging/media/,./index.html:2:staging,css/style.scss:3:staging/css

## .buster.json configuration

__examples:__

```
{
    "command": "bust":,
    "directives": [
        "media/meow.jpg:1:media",
        "./index.html:2:.",
        "css/test.css:3:css",
        "script/test.js:3:script"
    ]
}

{
    "command": "restore":,
    "directives": [
        "media/meow.jpg:1:media",
        "./index.html:2:.",
        "css/test.css:3:css",
        "script/test.js:3:script"
    ]
}

{
    "command": "bust":,
    "options": {
        "manifest": true,
        "verbose": true,
    },
    "directives": [
        "media/**/*.jpg:1:media",
        "./index.html:2:.",
        "css/test.css:3:css",
        "script/test.js:3:script"
    ]
}

{
    "command": "restore":,
    "options": {
        "verbose": true
    },
    "directives": [
        "media/**/*.jpg:1:media",
        "./index.html:2:.",
        "css/test.css:3:css",
        "script/test.js:3:script"
    ]
}

{
    "command": "bust":,
    "options": {
        "manifest": true
        "ignore": "media/original/**/*.jpg"
    },
    "directives": [
        "media/**/*.jpg:1:staging/media",
        "./index.html:2:staging",
        "css/test.css:3:staging/css",
        "script/test.js:3:staging/script"
    ]
}

{
    "command": "restore":,
    "options": {
        "ignore": "media/original/**/*.jpg"
    },
    "directives": [
        "media/**/*.jpg:1:staging/media",
        "./index.html:2:staging",
        "css/test.css:3:staging/css",
        "script/test.js:3:staging/script"
    ]
}
```
>__*Important*__ Buster expects *.buster.json* to reside in your project's root folder, alongside package.json.

## package.json configuration

__examples:__
```
"buster": {
    "command": "bust":,
    "directives": [
        "media/meow.jpg:1:media",
        "./index.html:2:.",
        "css/test.css:3:css",
        "script/test.js:3:script"
    ]
}

"buster": {
    "command": "restore":,
    "directives": [
        "media/meow.jpg:1:media",
        "./index.html:2:.",
        "css/test.css:3:css",
        "script/test.js:3:script"
    ]
}

"buster": {
    "command": "bust":,
    "options": {
        "manifest": true,
        "verbose": true
    },
    "directives": [
        "media/**/*.jpg:1:media",
        "./index.html:2:.",
        "css/test.css:3:css",
        "script/test.js:3:script"
    ]
}

"buster": {
    "command": "restore":,
    "options": {
        "verbose": true
    },
    "directives": [
        "media/**/*.jpg:1:media",
        "./index.html:2:.",
        "css/test.css:3:css",
        "script/test.js:3:script"
    ]
}

"buster": {
    "command": "bust":,
    "options": {
        "manifest": true
        "ignore": "media/original/**/*.jpg"
    },
    "directives": [
        "media/**/*.jpg:1:staging/media",
        "./index.html:2:staging",
        "css/test.css:3:staging/css",
        "script/test.js:3:staging/script"
    ]
}

"buster": {
    "command": "restore":,
    "options": {
        "ignore": "media/original/**/*.jpg"
    },
    "directives": [
        "media/**/*.jpg:1:staging/media",
        "./index.html:2:staging",
        "css/test.css:3:staging/css",
        "script/test.js:3:staging/script"
    ]
}
```

## how Buster determines its runtime configuration

Buster attempts to read configuration data from the *command line*, from *params passed to it from another program*, from *.buster.json* and from within *package.json*. For each source it finds, Buster attempts to validate its data and then determines if that source's data is *complete*. If the data is valid and it is complete, then Buster builds its runtime configuration from it.

> *Important* Buster considers a source's data to be complete if it contains a list of [operational directives](#operational-directives).

The following pseudo code describes the process Buster uses to construct its runtime configuration:

    if commandLineConfig is supplied and is complete 
        then use commandLineConfig
    else if paramsConfig is supplied
    and { ...commandLineConfig, ...paramsConfig } is complete
        then use { ...commandLineConfig, ...paramsConfig }
    else if busterConfig is supplied
    and { ...commandLineConfig, ...busterConfig } is complete
        then use { ...commandLineConfig, ...busterConfig }
    else if packageJsonConfig is supplied
    and { ...commandLineConfig, ...packageJsonConfig } is complete
        then use { ...commandLineConfig, ...packageJsonConfig }
    else terminate processing
    
This *blending* of configuration data affords a lot of flexibility for managing your Buster configurations:

* using command line configuration alone
* using command line configuration in combination with any one of the other sources of configuration data

## author's preferred approach to configuring Buster

I use the command line in conjunction with the other possible sources of configuration data.

As an example, when working with Node projects, I create 2 NPM tasks:

    "bust": "buster bust -m"

and

    "restore": "buster restore"

I place the operational directives in .buster.json.:
```
{
    "directives": [
        "media/**/*.jpg:1:staging/media",
        "./index.html:2:staging",
        "css/test.css:3:staging/css",
        "script/test.js:3:staging/script"
    ]
}
```
When I want to cache bust my project, I run the following at the command line:

    >$npm run bust

When I want to clean/restore my project, I run the following at the command line:

    >$npm run restore

## calling Buster programmatically
Buster can be called programmatically, allowing it to be used as part of a greater workflow:

```
const buster = require("@4awpawz/buster");

const paramsConfig = {
    command: "bust",
    options: {
        manifest: true
    },
    directives: [
        "media/**/*.jpg:1:staging/media",
        "./index.html:2:staging",
        "css/test.css:3:staging/css",
        "script/test.js:3:staging/script"
    ]
}

buster(paramsConfig);
```

## filing bugs and feature requests
* https://github.com/4awpawz/buster/issues

## to dos
1. ~~scriptable~~ - targeting release v0.1.0 - &check;
1. ~~non blocking/asynchronous processing~~ - targeting release v0.1.0 - &check;
1. ~~glob/ignore support~~ - targeting release v0.1.0 - &check;
1. ~~mirror source dir structure when destination path is different from source path~~ - targeting release v0.1.0 - &check;
1. ~~change manifest name to buster.manifest.json~~ - targeting release v0.1.0 - &check;
1. ~~verbose log option; default = false~~ - targeting release v0.1.0 - &check;
1. ~~readme (this file)~~ - targeting release v0.1.0 - &check;

## license
Copyright &copy; 2018, `Jeffrey Schwartz`. Released under the `MIT license`.