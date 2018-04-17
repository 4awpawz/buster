# a cache buster called buster
buster can fix your browser file cache problems

## features
1. buster copies your files using MD5 hash based file names and if required makes backups of them encorporating their original file name  and file type
1. buster can also search your files, looking for references to files by their original file names, and replaces those references with their corresponding MD5 hash based file names
1. buster can optionally save its manifest.json file
1. buster can be configured using butster.json or package.json and is scriptable via node

## installation
`npm install @jeffreyschwartz/buster --save-dev`

## usage
buster is very easy to configure because it uses a concept called *Operational Directives*, which define the actions buster takes for each file it touches:

example of an operational directive:
>`'./meow.jpg:1:./media/'` instructs buster to create a copy of the file ./meow.jpg using a hash based file name and to save the file to ./media/. If it makes it easier to reason about, think of an operational directive as input|process|output.

### cli

>$> buster -f 'fp:1:dp, fp:2:dp, fp:3:dp, ...'

1. `buster` is the name of the module to be called.

1. -f - Indicates that a list of comma separated operational directives follow. The list must be enclosed in either single or double quotes. 

1. fp - The path, including the file's name and file's type (if it has one), to the file buster will copy. It can be an absolute or relative path. Think of it as the input part of the operational directive.

1. :1: - Instructs buster to create a copy of the file using a hash based file name. Think of it as the process part of the operational directive.

1. :2: - Instructs buster to create a copy of the file and to search the copied file's content, replacing all references to file names that have corresponding hash based file names. A backup of the orignal file is saved with a file name of [original file name].buster-copy.[original file type] (e.g. `index.html` will be saved as `index.buster-copy.html`). Think of it as the process part of the operation directive.

1. :3: - Instructs buster to create a copy of the file using a hash based file name and to search the copied file's content, replacing all references to file names that have corresponding hash based file names. Thik of it as the process part of the operational directive.

1. dp - The path where buster will save the copied file to. It can be an absolute or relative path. Think of it as the output part of the operational directive.

### package.json

### buster.json

## options