# a cache buster called *Buster*
Buster fixes your browser file cache problems

## features
1. Buster can copy your files using MD5 hash-based file names and if required makes backups of them incorporating their original file names
1. Buster can search your files, looking for references to files by their original file names, and replaces those references with their corresponding MD5 hash-based file names
1. Buster can optionally save a manifest to a file called *manifest.json*
1. Buster can be configured using the command line, *.buster.json*, or *package.json*
1. Buster can be called and configured programmatically

## installation
    # installing locally
    npm install --save-dev @4awpawz/buster
    
    # installing globally
    npm install -g @4awpawz/buster

## operational directives
Buster uses a concept called *Operational Directives*, abbreviated *ods*, to direct the operation it performs for a given file. Each operational directive is comprised of 3 parts, as in *'input:operation:output'*:
1. input - the path to a file to operate on
2. operation - a number, surrounded by colons (i.e. ":"), in the range of 1 to 3, which is used to indicate the operation that Buster is to perform on the file identified by item 1 above. This number can be one of the following:
    * :1: - Instructs Buster to create a copy of the input file using a hash-based file name. The resulting hash-based file name will be *[original file name].[some hash value].[original file type]*.
    * :2: - Instructs Buster to create a copy of the input file and to search the copied file's content, replacing all references to file names with their corresponding hash-based file names. A backup of the original file is saved with a file name of *[original file name].buster-copy.[original file type]* (e.g. `index.html` will be saved as `index.buster-copy.html`).
    * :3: - Instructs Buster to create a copy of the input file using a hash-based file name and to search the copied file's content, replacing all references to file names with their corresponding hash-based file names. The resulting hash-based file name will be *[original file name].[some hash value].[original file type]*.
3. output - the path to where the operation's output (a file) is to be saved

__example__ of an operational directive:

>`'media/meow.jpg:1:./media'`

The above is an example of an operational directive that directs Buster to *create a copy* of the input file, *media/meow.jpg*, using a hash-based file name and to save the file to *./media*.

## configuration

Buster builds its runtime configuration, which consists of [options](#options) and [operational directives](#operational-directives), from configuration data passed to it from the [command line](#command-line) as well as from configuration data it receives from [another program](#calling-buster-programmatically), or from [.buster.json](#.buster.json) or from configuration data it finds in [package.json](#package.json).

### command line configuration

__running Buster from the command line__:

    >$buster [options] '[od[,...]]'

In the above, *buster* is the *command* to be called followed by an optional list of *options* (see [options](#options) for details) followed by an optional list of *ods* (comma separated; no spaces).

__example__ running Buster from the command line:
  
>\>$buster -d ./manifest.json media/meow.jpg:1:media/,./index.html:2:.,css/style.scss:3:css

### .buster.json configuration

```
{
    "options: {
        "manifest": true
    },
    "directives": [
        "media/meow.jpg:1:media",
        "./index.html:2:.",
        "css/test.css:3:css",
        "script/test.js:3:script"
    ]
}
```
>__*Important*__ Buster looks for *.buster.json* in your project's root directory, alongside package.json.

### package.json configuration
```
"buster": {
    "options: {
        "manifest": true
    },
    "directives": [
        "media/meow.jpg:1:media",
        "./index.html:2:.",
        "css/test.css:3:css",
        "script/test.js:3:script"
    ]
}
```

## options
Buster supports the following options:

### restore
The restore option instructs Buster to restore your files to their original state.

From the command line, include the *-r/--restore* option.

From within .buster.json, package.json and when calling from another program, include the *"restore: [true or false]"* key/value pair.

>__*Important*__ in order for restore to work, you must provide the same list of operational directives that was used when you ran Buster without the *restore* option.

### manifest
Buster can save a manifest file, named *manifest.json*, to the project's *root directory*.

From the command line, include the *-m/--manifest* option.

From within .buster.json, package.json and when calling from another program, include the *"manifest: [true or false]"* key/value pair.

__sample__ generated manifest file
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

* using command line configuration data solely if it is complete
* or when combined with any one of the other sources of configuration data

## author's preferred approach to configuring Buster

I personally find JSON based configuration easier to author and maintain than command line configuration. Taking advantage of Buster's *blending* of configuration data to arrive at its runtime configuration, I use the command line in conjunction with the other possible sources of configuration data.

As an example, when working with NPM based projects, I create 2 NPM tasks:

    "bust": "buster -m"

and

    "restore": "buster -r"

I also place my configuration data, in this case operational directives only, in .buster.json.:
```
{
    "directives": [
        "media/alphabet-arts-and-crafts-blog-459688-worked.jpg:1:media",
        "media/black-and-white-close-up-cobweb-worked.jpg:1:media",
        "media/cyclone-roller-coaster-coney-island-worked.jpg:1:media",
        "media/tatoo-handshake-worked.jpg:1:media",
        "./index.html:2:.",
        "css/test.css:3:css",
        "script/test.js:3:script"
    ]
}
```

When I want to run Buster to cache bust my project, I run the following at the command line:

    npm run bust

When I want Buster to clean/restore my project, I run the following at the command line:

    npm run restore

## calling Buster programmatically
Buster can be called programmatically, allowing it to be used as part of a greater workflow:

```
const buster = require("@4awpawz/buster");

const paramsConfig = {
    options: {
        manifest: true,
        restore: false
    },
    directives: [
        "media/alphabet-arts-and-crafts-blog-459688-worked.jpg:1:media",
        "media/black-and-white-close-up-cobweb-worked.jpg:1:media",
        "media/cyclone-roller-coaster-coney-island-worked.jpg:1:media",
        "media/tatoo-handshake-worked.jpg:1:media",
        "./index.html:2:.",
        "css/test.css:3:css",
        "script/test.js:3:script"
    ]
}

buster(paramsConfig);
```
## filing bugs and feature requests
* https://github.com/4awpawz/buster/issues

## to dos
1. scriptable - targeting release 0.1.0 - &check;
1. non blocking/asynchronous processing - targeting release 0.1.0 - &check;
1. glob support with excludes - will target release 0.2.0 if there are significant requests for this