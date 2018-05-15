# a cache buster called *Buster*
Buster busts your browser cache problems

## features

1. MD5 hash-based file names

1. cache bust in place or a different target

1. replaces references found in files to original files names with their MD5 hash-based file names

1. outputs a manifest to manifest.json

1. restores your project back to its original state

1. configurable with the command line, .buster.json, package.json and your own scripts

1. scriptable and easily integrates into your projects and workflow


## installation
    # installing locally
    npm install --save-dev @4awpawz/buster
    
    # installing globally
    npm install -g @4awpawz/buster

## operational directives
Buster uses a concept called *Operational Directives*, abbreviated *ods*, to direct the operation it performs for a given file. Each operational directive is comprised of 3 parts, as in *'input:operation:output'*:

1. input - an absolute or relative path to one or more files. Supports *globs/wildcard* patterns.

2. operation - a number, enclosed by colons (e.g. ":1:"), in the range of 1 to 3, which is used to indicate the operation that Buster is to perform on the file(s) identified by item 1 above. This number can be one of the following:

    * :1: - Instructs Buster to create a copy of each input file using MD5 hash-based file names. The copied file's name will be *[original file name].[some hash value].[original file type]* (e.g. `cat.[some hash value].jpg`).

    * :2: - Instructs Buster to search each input file's content, replacing all references to file names with their corresponding hash-based file names. A backup of each input file is saved with a file name of *[original file name].buster-copy.[original file type]* (e.g. `./index.buster-copy.html`).

    * :3: - Instructs Buster to create a copy of each input file using a hash-based file name and to search each copied file's content, replacing all references to file names with their corresponding hash-based file names. The copied file's hash-based file name will be *[original file name].[some hash value].[original file type]* (e.g. `app.[some hash value].js`).

3. output - an absolute or relative path to where the output of the operation is to be saved. Supports *globs/wildcard* patterns.

>__Important__ Buster assumes that all relative paths are relative to `process.cwd()`.

__example__ of an operational directive:

    `media/meow.jpg:1:media`

The above directs Buster to copy the file *media/housecat.jpg* and to save it to the *media* folder. 

The result of the above would be:

    media/
    |    | 
    |    housecat.jpg
    |    housecat.[unique hash name].jpg

__example__ of an operational directive using a glob:

    `media/**/*.jpg:1:staging/media`

The above directs Buster to recursively traverse all files and folders starting from within the *media* folder and to copy each file that matches the *`*.jpg`* pattern to the *staging/media* folder.

>__Important__ If a file's parent folder doesn't exist, Buster will create the folder first and then copy the file to it.

The result of the above would be:

    staging/    <-- 
    |    |
    |    media/    <-- 
    |        |
    |        housecat.[unique hash name].jpg
    |        purringcat.[unique hash name].jpg
    |        bigcats/    <--
    |            |
    |            lion.[unique hash name].jpg
    |            tiger.[unique hash name].jpg
    media/
    |    |
    |    housecat.jpg
    |    purringcat.jpg
    |    bigcats/
    |        |
    |        lion.jpg
    |        tiger.jpg

>__Important__ Buster implements its *glob* support using node package __glob__. Please refer to node package [*glob*](https://www.npmjs.com/package/glob) should you need additional information on using globs with Buster. 

## configuration

Buster builds its runtime configuration from the [sub commands](#sub-commands), [options](#options) and [operational directives](#operational-directives) it gets from the [command line](#command-line-configuration), from [another program](#calling-buster-programmatically), from [.buster.json](#.buster.json-configuration) or from [package.json](#package.json-configuration).

## sub commands
Buster has 2 sub commands:

### bust
`buster bust [options] <ods>`

Commands Buster to cache bust the files identified by the operational directives.

### restore
`buster restore [options] <ods>`

Restores the project back to its *original state*.

>__*Important*__ for *restore* to work, you must provide the same *ignored option files list* and the same *operational directives list* used to run the *bust* command.

## options
Buster supports the following options:

### ignore
`buster <sub command> [-i|--ignore] <'path/to/file[,path/to/file,...]'> <ods>`

Requires a list of one or more comma separated *paths to files* to ignore.

Supports *globs* and *wildcard* characters patterns.

### manifest
`buster <bust> [-m|--manifest]`

Saves the manifest to *manifest.json* in the project's *root directory*.

__sample__  manifest.json file:
```
{
    "manifest": [
        {
            "source": "media/meow.jpg",
            "operation": 1,
            "dest": "media",
            "hash": "d9c0594248cfc285a062f74146b12232",
            "hashFileName": "media/meow.d9c0594248cfc285a062f74146b12232.jpg"
        },
        {
            "source": "./index.html",
            "operation": 2,
            "dest": ".",
            "backupFileName": "./index.buster-copy.html"
        },
        {
            "source": "css/test.css",
            "operation": 3,
            "dest": "css",
            "hash": "7ebc808154a564f44b82d4dea26c1246",
            "hashFileName": "css/test.7ebc808154a564f44b82d4dea26c1246.css"
        },
        {
            "source": "script/test.js",
            "operation": 3,
            "dest": "script",
            "hash": "48cdf598aba98f3d7d98d3703f394573",
            "hashFileName": "script/test.48cdf598aba98f3d7d98d3703f394573.js"
        }
    ]
}
```

### verbose
`buster <sub command> [-v|--verbose] <ods>`

Provides detailed loging

## command line configuration

    Usage: buster <bust|restore> [options] <ods ...>

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
>__*Important*__ Buster expects *.buster.json* to reside in your project's root directory, alongside package.json.

## package.json configuration

__examples:__
```
"buster": {
    {
        "command": "bust":,
        "directives": [
            "media/meow.jpg:1:media",
            "./index.html:2:.",
            "css/test.css:3:css",
            "script/test.js:3:script"
        ]
    }
}

"buster": {
    {
        "command": "restore":,
        "directives": [
            "media/meow.jpg:1:media",
            "./index.html:2:.",
            "css/test.css:3:css",
            "script/test.js:3:script"
        ]
    }
}

"buster": {
    {
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
}

"buster": {
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
}

"buster": {
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
}

"buster": {
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
1. ~~scriptable~~ - targeting release 0.1.0 - &check;
1. ~~non blocking/asynchronous processing~~ - targeting release 0.1.0 - &check;
1. ~~glob/ignore support~~ - targeting release 0.1.0 - &check;
1. ~~mirror source dir structure when destination path is different from source path~~ - targeting release 0.1.0 - &check;
1. ~~change manfiest name to buster.manifest.json~~ - targeting release 0.1.0 - &check;
1. ~~verbose log option; default = false~~ - targeting release 0.1.0 - &check;
1. readme (this file) - targeting release 0.1.0

## license
Copyright &copy; 2018, `Jeffrey Schwartz`. Released under the `MIT license`.