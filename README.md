# A Cache Buster Called *Buster*
Buster busts your browser cache problems

## Features

1. renames files using MD5 hash-based cache busting file names

1. cache bust in place or target a different folder

1. replaces references in files to original files names with their MD5 hash-based file names

1. optionally outputs a manifest file to buster.manifest.json

1. can restore your project back to its original state

1. intuitive configuration via the command-line, .buster.json, and package.json

1. scriptable

1. easily integrates into your projects and workflows

## Installation
    $ npm install -g @4awpawz/buster

    $ npm install --save-dev @4awpawz/buster
    
## Operational Directives
Buster employs a concept called an *Operational Directive*, abbreviated *od*, which you *declare* in your configuration and which Buster uses to direct the operations it performs on your project's files. Each od is comprised of 3 parts, an [input](#input), an [operation](#operation), and an [output](#output).

### Input
A relative path to one or more files.

Supports *globs/wildcard* patterns.

>__Important__ Buster assumes that all relative paths are relative to `process.cwd()`.

>__Important__ Buster implements its *glob* support using node package __glob__. Please refer to node package [*glob*](https://www.npmjs.com/package/glob) should you need additional information on using globs with Buster. 

### Operation
Indicates the *actions* that Buster is to perform on the od's input file(s). It is a number, surrounded by colons (e.g. ":1:"). The following 3 operations are currently supported:

#### :1:
>__Important__ This operation should be used for files whose content is not to be searched for file names but whose own file names need to be hashed for cache busting purposes (i.e. `.jpg, .gif, etc.`).

* Instructs Buster to save a copy of each of the od's input files to the od's output destination with a unique MD5 hash-based file name.

* The format of each unique MD5 hash-based file name will be *[original file name].[unique hash value].[original file type]* (e.g. `cat.[unique hash value].jpg`).

#### :2:
>__Important__ This operation should be used for files whose content is to be searched for file names but whose own file names are not to be hashed (i.e. `index.html`).

* Instructs Buster to backup each of the od's input files in its current location with a file name of *[original file name].buster-copy.[original file type]* (e.g. `./index.buster-copy.html`) only if both the input file's path and output's destination path are the same.

* Instructs Buster to then copy each of the od's input files to the od's output destination only if both the input file's path and output's destination path are different.

#### :3:
>__Important__ This operation should be used for files whose content is to be searched for file names and whose own file names need to be hashed for cache busting purposes (i.e. `.js, .scss, .css, etc.`).

* Instructs Buster to save a copy of each of the od's input files to the od's output destination with a unique MD5 hash-based file name.

* The format of each unique MD5 hash-based file name will be *[original file name].[unique hash value].[original file type]* (e.g. `cat.[unique hash value].js`).

### Output
A relative path to where the files are to be saved.

>__Important__ Buster assumes that all relative paths are relative to `process.cwd()`.

>__Important__ When saving files to an od's output destination, Buster will make folders and their parents if needed.

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

## Configuration

Buster builds its runtime configuration from the [sub commands](#sub-commands), [options](#options) and [operational directives](#operational-directives) it gets from the [command-line](#command-line-configuration), from [a script](#calling-buster-from-a-script), from [.buster.json](#busterjson-configuration) or from [package.json](#packagejson-configuration).

## Sub Commands
Buster has 2 sub commands:

### Bust
`buster bust [options] <ods>`

Commands Buster to cache bust the files identified by the operational directives.

### Restore
`buster restore [options] <ods>`

Commands Buster to restore the project back to its *original state*.

>__*Important*__ for *restore* to work, you must provide the same *ignored option files list* and the same *operational directives list* used to run the *bust* command.

## Options
Buster supports the following options:

### Ignore
`buster <sub command> [-i|--ignore] <'path/to/file[,path/to/file,...]'> <ods>`

Requires a *quoted* list of one or more comma separated *paths to files* to ignore.

Supports *globs* and *wildcard* characters patterns.

### Manifest
`buster <bust> [-m|--manifest]`

Saves the manifest to *buster.manifest.json* in the project's *root folder*.

__sample__  buster.manifest.json file:
```json
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

### Safe Mode
`since v0.2.0`

`buster <bust> [-s|--safe-mode]`

Instructs buster to process all its input files in their current folders without moving, copying or renaming them. 

>__*WARNING* This is an experimental feature and may see breaking changes in future releases or may even be removed altogether.__

>__*WARNING* *SAFE MODE DOES NOT SUPPORT THE BACKUP OPTION!*__ Never use safe mode when cache busting files in folders used to develop your web site. Safe Mode doesn't create backups of your files so original files are lost forever! Safe Mode should only be used for cache busting *public* folders (i.e. public, dist, staging, .etc) whose content is placed there during a project's build process.

### Verbose
`buster <sub command> [-v|--verbose] <ods>`

Provides verbose logging

## Command-Line Configuration

At the command-line type `buster -h`:

![screen shot 2018-05-15 at 9 22 19 am](https://user-images.githubusercontent.com/271288/40059607-74ecf2d8-5822-11e8-8d26-32d63c7849ff.png)

__examples:__

    $ buster bust media/meow.jpg:1:media/,./index.html:2:.,css/style.scss:3:css

    $ buster restore media/meow.jpg:1:media/,./index.html:2:.,css/style.scss:3:css

    $ buster bust -m -v media/**/*.jpg:1:media/,./index.html:2:.,css/style.scss:3:css

    $ buster restore -v media/**/*.jpg:1:media/,./index.html:2:.,css/style.scss:3:css

    $ buster bust -m -i 'media/original/**/*.jpg' media/**/*.jpg:1:staging/media/,./index.html:2:staging,css/style.scss:3:staging/css

    $ buster restore -i 'media/original/**/*.jpg' media/**/*.jpg:1:staging/media/,./index.html:2:staging,css/style.scss:3:staging/css

## .buster.json Configuration

__examples:__

```json
{
    "command": "bust",
    "directives": [
        "media/meow.jpg:1:media",
        "./index.html:2:.",
        "css/test.css:3:css",
        "script/test.js:3:script"
    ]
}

{
    "command": "restore",
    "directives": [
        "media/meow.jpg:1:media",
        "./index.html:2:.",
        "css/test.css:3:css",
        "script/test.js:3:script"
    ]
}

{
    "command": "bust",
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
    "command": "restore",
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
    "command": "bust",
    "options": {
        "manifest": true,
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
    "command": "restore",
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

## package.json Configuration

__examples:__
```json
"buster": {
    "command": "bust",
    "directives": [
        "media/meow.jpg:1:media",
        "./index.html:2:.",
        "css/test.css:3:css",
        "script/test.js:3:script"
    ]
}

"buster": {
    "command": "restore",
    "directives": [
        "media/meow.jpg:1:media",
        "./index.html:2:.",
        "css/test.css:3:css",
        "script/test.js:3:script"
    ]
}

"buster": {
    "command": "bust",
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
    "command": "restore",
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
    "command": "bust",
    "options": {
        "manifest": true,
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
    "command": "restore",
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

## How Buster Resolves Its Runtime Configuration

Buster attempts to read configuration data from *params passed to it from a script*, from the *command-line*, from *.buster.json* and from within *package.json*. For each source it finds, Buster attempts to validate its data and then determines if that source's data is *complete*. If the data is valid and it is complete, then Buster builds its runtime configuration from it.

> *Important* Buster considers a source's data to be complete if it contains a [sub command](#sub-commands) (i.e. "bust" or "restore") and one or more [operational directives](#operational-directives).

The following pseudo code describes the process Buster uses to construct its runtime configuration:

    if paramsConfig is supplied and is complete
        then use paramsConfig
    else if commandLineConfig is supplied and is complete 
        then use commandLineConfig
    else if busterConfig is supplied
    and { ...commandLineConfig, ...busterConfig } is complete
        then use { ...commandLineConfig, ...busterConfig }
    else if packageJsonConfig is supplied
    and { ...commandLineConfig, ...packageJsonConfig } is complete
        then use { ...commandLineConfig, ...packageJsonConfig }
    else terminate processing
    
This *blending* of configuration data affords a lot of flexibility for managing your Buster configurations:

* use only configuration passed from a script
* use only command-line configuration
* use configuration from .buster.json in combination with command-line configuration.
* use configuration from package.json in combination with command-line configuration.

## Example Project Configuration

When working with a Node projects, for example, create 2 NPM tasks:

    "bust": "buster bust -m"

and

    "restore": "buster restore"

Place the operational directives in .buster.json.:
```json
{
    "directives": [
        "media/**/*.jpg:1:staging/media",
        "./index.html:2:staging",
        "css/test.css:3:staging/css",
        "script/test.js:3:staging/script"
    ]
}
```
To *cache bust* the project, run the following at the command-line:

    $ npm run bust

To *restore* the project, run the following at the command-line:

    $ npm run restore

## Calling Buster From A Script
Buster can be called from a *script*, allowing it to be used as part of a greater workflow.

Scripting Buster to *cache bust* your project:

```js
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

The above call to Buster is *synchronous*, and therefore execution will not wait for Buster to complete.

To wait for Buster to complete, call buster *asynchronously* using async/await, as in the following:

```js
await buster(paramsConfig);
```

Scripting Buster to *restore* your project is just as easy:

```js
const buster = require("@4awpawz/buster");

const paramsConfig = {
    command: "restore",
    directives: [
        "media/**/*.jpg:1:staging/media",
        "./index.html:2:staging",
        "css/test.css:3:staging/css",
        "script/test.js:3:staging/script"
    ]
}

buster(paramsConfig);
```

## Filing Bugs And Feature Requests
* https://github.com/4awpawz/buster/issues

## Changelog

### v0.2.1

Major and minor bug fixes - includes but not limited to the following:

* Address issue [`#9`](https://github.com/4awpawz/buster/issues/9) which would sometimes cause `restore` to fail. This fix totally replaces the one introduced in v0.2.0, and now handles the issue earlier in the restore processing cycle.

* Addresses issue [`10`](https://github.com/4awpawz/buster/issues/10) which would cause buster to fail when reading command line configuration data belonging to the application that launched it with paramsConfig.

### v0.2.0

Major refactor -  includes but not limited to the following:

* Introduces experimental ["safe mode"](#safe-mode) feature, resolves [`#6`](https://github.com/4awpawz/buster/issues/6).

* v0.1.6 breaks handling of backup files bug, fixes [`#5`](https://github.com/4awpawz/buster/issues/5).

* Removes hashed files from the manifest returned by glob during restore.

* Implements new resolution of destination paths.

* Removes the "file-exists" package from the project.

* Catching some async exceptions to prevent unresolved promise exceptions.

* Configuration attempts to resolve from paramsConfig (i.e. passed via a script) first.

* Updated README.md

### v0.1.6

* Addresses a bug in command-line processing which would cause Buster to crash when the user enters only *"bust"* or *"restore"* from the command-line.

* Addresses a bug in od processing which would cause Buster to crash when attempting to create folders that already  exist.

* Addresses a bug in od processing which would cause Buster to crash when attempting to delete files that no longer exist.

## License
Copyright &copy; 2018, `Jeffrey Schwartz`. Released under the `MIT license`.