# a cache buster called *Buster*
Buster can fix your browser file cache problems

## features
1. Buster copies your files using MD5 hash-based file names and if required makes backups of them encorporating their original file name and file type
1. Buster can also search your files, looking for references to files by their original file names, and replaces those references with their corresponding MD5 hash-based file names
1. Buster can optionally save a manifest to a file called *manifest.json*
1. Buster can be configured using the command line, *.butster.json*, or *package.json*
1. Buster can be called programatically

## installation
>npm install @jeffreyschwartz/buster

## operational directives
Buster uses a concept called *Operational Directives* to direct the operation it performs for a given file. Each operational directive is comprised of 3 parts, as in *'input:operation:output'*:
1. input - the path to a file to operate on
2. operation - a number, surrounded by colons (i.e. ":"), in the range of 1 to 3, which is used to indicate the operation that Buster is to perform on the file identified by item 1 above. This number can be one of the following:
    * :1: - Instructs Buster to create a copy of the input file using a hash-based file name. The resulting hash-based file name will be *[original file name].[some hash value].[original file type]*.
    * :2: - Instructs Buster to create a copy of the input file and to search the copied file's content, replacing all references to file names with their corresponding hash-based file names. A backup of the orignal file is saved with a file name of *[original file name].buster-copy.[original file type]* (e.g. `index.html` will be saved as `index.buster-copy.html`).
    * :3: - Instructs Buster to create a copy of the input file using a hash-based file name and to search the copied file's content, replacing all references to file names with their corresponding hash-based file names. The resulting hash-based file name will be *[original file name].[some hash value].[original file type]*.
3. output - the path to where the operation's output (a file) is to be saved

__example__ of an operational directive:

>`'./meow.jpg:1:./media'`

The above is an example of an operational directive that directs Buster to *create a copy* of the input file, *./meow.jpg*, using a hash-based file name and to save the file to *./media*.

## configuration

Buster builds its runtime configuration, which consists of [options](#options) and [operational directives](#operational-directives), from configuration data passed to it from the *command line* as well as from configuration data it receives from *parameters passed to it directly from another program*, or from *.buster.json* or from configuration data it finds in *package.json*.

### command line

__running Buster from the command line__:

    >$ buster [options] '[od[,...]]'

In the above, *buster* is the *command* to be called followed by an optional list of *options* (see [options](#options) for details) followed by an optional list of *ods* (comma separated; no spaces).

__example__ running Buster from the command line:
  
>buster -d ./manifest.json media/meow.jpg:1:media/,./index.html:2:.,css/style.scss:3:css


### package.json
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

### .buster.json
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

## options
Buster supports the following options:

### restore
Buster can restore your files to their original state if you include the *-r* or *--restore* option on the command line or the *"restore: [true or false]"* key/value pair in either .buster.json or package.json.

>__*Important*__ you must provide the same list of operational directives that was used when you ran Buster without the *restore* option.

### manifest
Buster can generate and save a manifest file if you provide the *-m/--manifest* option on the command line or the *"manifest: [true or false]"* key/value pair in .buster.json or package.json.

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
Buster prioritizes its sources of configuration data as follows:
1. from the command line
1. from params passed to Buster programatically [see calling Buster programatically](#calling-buster-programatically)
1. from .buster.json
1. from package.json

Buster attempts to find configuration data from all 4 of the above. For each one it finds, Buster attempts to validate it and then determines if that source's data is complete. If it is determined that it is complete, Buster uses it in its runtime configuration.

To determine if the configuration data from any particular source is complete, Buster checks if the source supplies a list of [operational directives](#operational-directives). If it does, Buster will use that source to construct its runtime configuration.

The following psudo code describes the process Buster uses to construct its runtime configuration:

    if commandLineConfig is supplied and is complete 
        then use commandLineConfig
    else if paramsConfig is supplied and is complete
        then use { ...commandLineConfig, ...paramsConfig }
    else if busterConfig is supplied and is complete
        then use { ...commandLineConfig, ...busterConfig }
    else if packageJsonConfig is supplied and is complete
        then use { ...commandLineConfig, ...packageJsonConfig }
    else termminate processing
    
This affords a flexible means to manage your Buster configuration:

* using command line configuration data solely if it is complete
* or when combined with and complete with any one of the other sources of configuration data

## author's prefered approach to configuring Buster

I personally find JSON based configuration easier to author and maintain than command line configuration. Taking advantage of Buster's *blending* of configuration data to arrive at its runtime configuration, I use the command line in conjustion with .buster.json and/or package.json.

As an example, when working with NPM based projects, I will create two NPM tasks:

    "bust": "buster -m"

and

    "restore": "buster -r"

I will also place my configuration data, in this case operational directives only, in .buster.json.
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

Now, when I want to run Buster to cache bust my project, I merely have to type the following at the commnd line

    npm run bust

and when I want to clean/restore my project, I merely have to type the following at the command line

    npm run restore

## calling Buster programatically
Buster can be called programatically, allowing it to be used as part of a greater workflow:

```
const buster = require("@jeffreyschwartz/buster");

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

## to dos
1. synchronous processing
1. glob support with excludes
1. scriptability