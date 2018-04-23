# a cache buster called buster
buster can fix your browser file cache problems

## features
1. buster copies your files using MD5 hash-based file names and if required makes backups of them encorporating their original file name and file type
1. buster can also search your files, looking for references to files by their original file names, and replaces those references with their corresponding MD5 hash-based file names
1. buster can optionally save its manifest to a file in JSON format 
1. buster can be configured using the command line, *.butster.json*, or *package.json*

## installation
>npm install @jeffreyschwartz/buster --save-dev

## operational directives
Buster uses a concept called *Operational Directives* to direct the operation it performs for a given file.
Each operational directive is comprised of 3 parts, as in *'input:operation:output'*:
1. input - the path to a file to operate on
2. operation - a number, surrounded by colons (i.e. ":"), in the range of 1 to 3, which is used to indicate the operation that Buster is to perform on the file identified by item 1 above. This number can be one of the following:
    * :1: - Instructs buster to create a copy of the file using a hash-based file name.
    * :2: - Instructs buster to create a copy of the file and to search the copied file's content, replacing all references to file names with their corresponding hash-based file names. A backup of the orignal file is saved with a file name of [original file name].buster-copy.[original file type] (e.g. `index.html` will be saved as `index.buster-copy.html`).
    * :3: - Instructs buster to create a copy of the file using a hash-based file name and to search the copied file's content, replacing all references to file names with their corresponding hash-based file names.
3. output - the path to where the operation's output (a file) is to be saved

example of an operational directive:
>`'./meow.jpg:1:./media'`

The above operational directive example instructs Buster to *create a copy* of the file *./meow.jpg* using a hash-based file name and to save the file to *./media*.

## configuration

Buster builds its runtime configuration from configuration data passed to it from the command line as well as from
configuration data it finds in either .buster.json or package.json, respectively. .buster.json takes priority over package.json.

### cli

    >$ buster [options] '[od[,...]]'

In the above cli example,  *buster* is the *command* to be called followed by an optional list of *options* followed by an optional list of *ods*.

### package.json
```json
  "buster": {
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

### .buster.json
```json
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

## options