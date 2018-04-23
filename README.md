# a cache buster called Buster
Buster can fix your browser file cache problems

## features
1. Buster copies your files using MD5 hash-based file names and if required makes backups of them encorporating their original file name and file type
1. Buster can also search your files, looking for references to files by their original file names, and replaces those references with their corresponding MD5 hash-based file names
1. Buster can optionally save its manifest to a file in JSON format 
1. Buster can be configured using the command line, *.butster.json*, or *package.json*

## installation
>npm install @jeffreyschwartz/Buster --save-dev

## operational directives - ods
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

Buster builds its runtime configuration, which consists of options and operational directives, from configuration data passed to it from the *command line* as well as from configuration data it finds in either *.buster.json* or *package.json*, respectively. .buster.json takes *priority* over package.json.

### command line

__running Buster from the command line__:

>$ buster [options] '[od[,...]]'

In the above, *Buster* is the *command* to be called followed by an optional list of *options* (see [options](#options) for details) followed by an optional list of *ods* (comma separated; no spaces).

__example__ running Buster from the command line:
  
>buster -m ./manifest.json media/meow.jpg:1:media/,./index.html:2:.,css/style.scss:3:css


### package.json
```json
"buster": {
    "options: {
        "manifest": "./manifest.json"
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
```json
{
    "options: {
        "manifest": "./manifest.json"
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
1. restore: *'-r' or '--restore*' from the command line; *"'restore':[boolean]"* from within a config file.
2. manifest: *'-m [path]' or '--manifest [path]'*  from the command line; *"'manifest':[path]"* from within a config file.

## manifest
Buster can generate and save a manifest file if you provide the -m/--manifest option on the command line or the "manifest" key in .buster.json or package.json. See [options](#options) above for details.
 
__sample__ generated manifest file
```json
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

## to dos
1. synchronous processing
1. glob support with excludes
1. scriptability