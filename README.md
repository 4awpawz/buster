# a cache buster called buster
buster can fix your browser file cache problems

## features
1. buster reanames your content files using MD5 hash based file names and makes backups of them with their original name
1. buster searches your files, looking for references to file by their original names, and replaces those name references with their corresponding MD5 hash based file names
1. buster will optionally generate and save a manifest.json file
1. scriptable, config file, package.json and cli supported
1. non blocking file io

## installation
`npm install @jeffreyschwartz/buster --save-dev`

## usage
buster is very easy to configure because it uses a concept called *Operational Directives*, which define the actions buster takes for each file it touches:

example of an operational directive:
>`'./meow.jpg:1:./media/'` instructs buster to create a copy of the file ./meow.jpg using a hash based file name and to save the file to ./media/.

### Via cli

>$> buster -f 'fp:1:dp, fp:2:dp, fp:3:dp, ...'

1. `buster` is the name of the module to be called.

1. -f - indicates a list of operational directives follow.The list must be enclosed in either single or double quotes. 

1. fp - the path, including the file's name and extension (if it has one), to the file buster will copy. It can be a full or relative path.

1. :1 - is the operational directive that instructs buster to create a copy of the file using a hash based file name.

1. :2 - is the  operational directive that instructs buster to create a copy of the file and to search the copied file's content, replacing all references to file names that have corresponding hash based file names. A backup of the orignal file is saved with a file name of [original file name].buster-copy.[original file extension] (e.g. `index.html` will be saved as `index.buster-copy.html`).

1. :3 - is the operational directive that instructs buster to perform both operational directive :1 and operational directive :2.   

1. dp - the path where buster will save the copied file to. It can be a full or relative path.

### Via buster.json

### Via package.json

## options