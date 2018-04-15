# a cache buster called buster

## features
1. generate cache busting files using hashed file names and their backups with their original names
2. modify file content, replacing references to original file names with hashed file names
3. scriptable, config file, package.json and cli supported
4. non blocking

## installation

## usage

### Via cli

>$> buster -f 'fp:1:dp, fp:2:dp, fp:3:dp, ...'

1. where `buster` is the name of the module to be called.

1. where -f = list of files to be operated on. 

1. where fp = path to a file. It can be a full path or it can be relative to the current directory.

1.  where :1 = operational directive to create a copy of the file using a hash based file name.

1. where :2 = operational directive to search the content of the file and change all references to file names within the file to their corresponding hashed file names.

1. where :3 = operational directive to perform both operational directive :1 and operational directive :2.   

1. where dp = target path for a processed file. It can be a full path or it can be relative to the current directory.
