# <img src="/github/buster.png" width="152" height="181" alt="Bulldog"> A Cache Buster Called *Buster*

Buster busts your browser cache problems!

## Version

1.0.0

## Features

* Cache busts your project's files in place.

* Fingerprints (renames) files based on their content using MD5 hash-based cache busting file names.

* Replaces references in files to original file names with their MD5 hash-based file names.

* Optionally outputs a manifest file to buster.manifest.json.

* Simple and intuitive configuration using .buster.json.

* Invokable via the command line and scriptable.

* Easily integrates into your project workflow.

## Installation

### Install Globally

This is the ideal solution if you want to use Buster as a general utility from the command line.

    $ npm install -g @4awpawz/buster

### Install Locally

This is the ideal solution if you want to integrate Buster into your project.

    $ npm install --save-dev @4awpawz/buster

## Important

* __Buster Is Destructive__. Buster does not make backups of your files. Buster performs its operations directly on the files that operational directives indicate. See "A Typical Buster Workflow" below.

* __Buster does not generate hashes based on file names__. Buster generates hashes based on the content of the files targeted by its operational directives. An empty file will always generate the same hash and multiple empty files will all have the same hash as each other. This is not a "bug" as the hash itself represents the content of the file and as all empty files have the same content (none, in this case) they will all "share" the same hash.

## Buster Primer

### Site Relative File Paths And Site Relative URLs

In the documentation that follows, references are made to __site relative file paths__ and to __site relative URLs__.

1. "site relative file paths" pertain strictly to your project's file structure. They are used to declare the __input__ in [operational directives](#operational-directives) when declaring the file paths to assets in your project that you want targeted by Buster for cache busting.

1. "Site relative URLs" pertain strictly to your website's runtime environment and are used to reference assets throughout your site (e.g. the _src attribute_ of an img tag, the _href_ attribute of a link tag, the _URL() CSS function_  declared inside of a CSS stylesheet).

The important thing here is to understand that in order for Buster to perform its cache busting you, the developer, must insure that your site employs site relative URLs when referencing its assets. This is because Buster converts your site relative file paths to site relative URLs which it then uses to search the content of your site's files for site relative URLs that need to be updated to point to the assets it has fingerprinted with unique hashes.

#### A Typical Buster Work Flow

Your development build tool generates your __production ready site__ (as opposed to development) into your project's __release folder__. When configuring Buster to cache bust your site, you would target your project files in the __release folder__ by using __site relative file paths__ in your Buster configuration's [operational directives](#operational-directives). Then from the root of your project you can use the command line to run Buster to cache bust your site in the release folder. You can then run your site from the release folder to insure that it is functioning as expected and once it is determined that it is functioning as expected you can then deploy your site directly from the release folder to its server using a command line utility such as rsync.

In a typical website project with the following or similar project structure

```
|- myproject
|- |- release/
|- |- |- media/
|- |- |- |- housecat.jpg
|- |- |- index.html
|- |- .buster.json
```

the site relative file path used in an operational directive to target housecat.jpg would be release/media/housecat.jpg and the site relative URL used to identify the image file in the browser would be media/housecat.jpg.

## Operational Directives

Buster employs a concept called an *Operational Directive*, abbreviated *od*, which you *declare* in your _.buster.json_ configuration file and which Buster uses to direct the operations it performs on your project's files. Each od is comprised of 2 parts, an [input](#input), and an [operation](#operation).

### Input

A site relative file path to one or more files.

Supports *globs/wildcard* patterns.

>__Important__ Buster assumes that all site relative file paths are relative to `process.cwd()`.

>__Important__ Buster implements its *glob* support using node package __glob__. Please refer to node package [*glob*](https://www.npmjs.com/package/glob) should you need additional information on using globs with Buster.

### Operation

Indicates the *actions* that Buster is to perform on the od's input file(s). It is a number preceded by a colon which separates the number from the input (e.g. ":1"). The following 3 operations are currently supported:

#### :1

Apply this operation only to those files whose own file names are to be fingerprinted for cache busting purposes (e.g. `.jpg, .gif, .map`).

The format of each unique MD5 hash-based file name will be __[original file's base name].[unique hash].[original file's extension]__ (e.g. `cat.[unique hash].jpg`). Should the original file's base name contain 1 or more _periods_ (e.g. __main.js__.map) the format of the MD5 hash-based file name will, as an example, be __main.[unique hash].js.map__.

#### :2

Apply this operation only to those files whose contents are to be searched for site relative URLs that point to assets whose file names have been fingerprinted and therefor need to be updated and whose own file names are not to be fingerprinted for cache busting purposes.

#### :3

Apply this operation only to those files whose own file names are to be fingerprinted for cache busting purposes (e.g. `.jpg, .gif, .map`) and whose contents are to be searched for site relative URLs that point to assets whose file names have been fingerprinted and therefor need to be updated.

The format of each unique MD5 hash-based file name will be __[original file's base name].[unique hash].[original file's extension]__ (e.g. `cat.[unique hash].jpg`). Should the original file's base name contain 1 or more _periods_ (e.g. __main.js__.map) the format of the MD5 hash-based file name will, as an example, be __main.[unique hash].js.map__.

### Operational Directive Examples

#### Example Operational Directives Using Site Relative File Path:

Given the following project structure

```
|- myproject
|- |- release/
|- |- |- media/
|- |- |- |- housecat.jpg
|- |- |- index.html => contains img tag with a site relative url for its src i.e. <img src="/media/housecat.jpg">
|- |- .buster.json
```

and running Buster from the command line in the myproject folder with the following operational directives

```
`release/media/housecat.jpg:1`
`release/index.html:2`
```

will result in the following:

```
|- myproject
|- |- release/
|- |- |- media/
|- |- |- |- housecat.[unique hash].jpg
|- |- |- index.html => now contains img tag whose src attribute points to hashed img i.e. <img src="/media/housecat.[unique hash].jpg">
|- |- .buster.json
```

#### Example Operational Directives Using Site Relative File Paths And Globs:

Given the following project structure

```
|- myproject
|- |- release/
|- |- |- media/
|- |- |- |- housecat.jpg
|- |- |- |- purringcat.jpg
|- |- |- |- bigcats/
|- |- |- |- |- lion.jpg
|- |- |- |- |- tiger.jpg
|- |- |- index.html => contains img tags with site relative urls for its src e.g. <img src="/media/housecat.jpg">, <img src="/media/bigcats/lion.jpg">
|- |- .buster.json
```

and running Buster with the following directives

```
`release/media/**/*.jpg:1
`release/**/*.html:2`
```

will result as follows:

```
|- myproject
|- |- release/
|- |- |- media/
|- |- |- |- housecat.[unique hash].jpg
|- |- |- |- purringcat.[unique hash].jpg
|- |- |- |- bigcats/
|- |- |- |- |- lion.[unique hash].jpg
|- |- |- |- |- tiger.[unique hash].jpg
|- |- |- index.html => now contains img tags whose src attributes point to hashed img i.e. <img src="/media/housecat.[unique hash].jpg">, <img src="/media/bigcats/lion.[unique hash].jpg">
|- |- .buster.json
```

## buster.json Configuration

>__*Important*__ Buster expects *.buster.json* to reside in your project's root folder, alongside package.json.

```json
{
    "options": {
        "manifest": true,
        "verbose": true,
        "ignore": "media/original/**/*.jpg,media/original/**/*.gif"
    },
    "directives": [
        "release/media/**/*.jpg:1",
        "release/./index.html:2",
        "release/css/test.css:3",
        "release/script/test.js:3"
    ]
}
```

### Options

Buster supports the following configuration options:

### ignore

A _quoted list_ of one or more comma separated _site relative file paths_ to files that are to be ignored, defaults to `""`.

Supports _globs_ and _wildcard_ characters patterns.

### manifest

A _boolean_, `true` to save the manifest to _buster.manifest.json_ in the project's _root folder_, defaults to `false`.

### verbose

A _boolean_, `true` to output verbose logging, defaults to `false`.

## Typical Workflows

### Integrating Buster Into Your Project's Workflow

Install Buster locally:

```shell
myproject > $ npm install -D @4awpawz/buster
```

Then create a .buster.json configuration file in your project's root folder, alongside package.json:

```json
{
    "directives": [
        "release/media/**/*.jpg:1",
        "release/css/**/*.css.map:1",
        "release/scripts/**/*.js.map:1",
        "release/**/*.html:2",
        "release/css/**/*.css:3",
        "release/scripts/**/*.js:3"
    ]
}
```

Then add the following to your project's package.json's `scripts` property:

```json
"scripts": {
    "bust": "buster"
}
```

You can then run buster from the command line by invoking it as follows:

```shell
myproject > npm run bust
```

### Calling Buster From Within A Script

Buster can be called from within a *script*, allowing it to be used as part of a greater workflow:

```js
const buster = require("@4awpawz/buster");

const paramsConfig = {
    options: {
        manifest: true
    },
    directives: [
        "release/media/**/*.jpg:1",
        "release/css/**/*.css.map:1",
        "release/scripts/**/*.js.map:1",
        "release/**/*.html:2",
        "release/css/**/*.css:3",
        "release/scripts/**/*.js:3"
    ]
}

await buster(paramsConfig);
```

## Filing Bugs And Feature Requests
* https://github.com/4awpawz/buster/issues

## Changelog

### v1.0.0

This is the first major release of Buster and incorporates many breaking changes from prior versions. Most notably, prior versions had a "safe mode" configuration option that would instruct Buster to cache bust "in place", meaning that it would not create backups and would not be able to restore files to their prior state. As it turns out, the vast majority of Buster's users are using "safe mode" because it fits their workflow of generating their site into a dedicated folder that can be cache busted and that could easily be repopulated by just regenerating the site. These changes were implemented to refactor Buster to precisely match this typical workflow. You can read more about the decision to refactor Buster at <a target="_blank" href="https://gettriossg.com/blog/news/2021/03/23/next-feature-release/">https://gettriossg.com/blog/news/2021/03/23/next-feature-release/</a>.

### v0.3.1

This release addresses fixes for security warnings for packages used internally by Buster only. There are no changes to the code base.

### v0.3.0

This release addresses one bug and fixes for security warnings for packages used internally by Buster only. Also landing with this release is reduced console output; use the `verbose` config option if needed.

Major bug fixes:

* Addresses issue [`#14`](https://github.com/4awpawz/buster/issues/14) which could cause Buster to mangle hashed file names. **Please note that beginning with this release, Buster now generates hashed file names as *[hash]-[file name].[file extension]*.  You are strongly advised to upgrade your projects and rebuild them.**

### v0.2.4

This release addresses fixes for security warnings for packages used internally by Buster only. There are no changes to the code base.

### v0.2.3

Major bug fixes:

* Addresses issue [`#13`](https://github.com/4awpawz/buster/issues/13) which would cause Buster to crash when reading a configuration file that doesn't exist.


* Addresses issue [`#12`](https://github.com/4awpawz/buster/issues/12) which would cause Buster to crash when setting paramsConfig to a default value of `{}` to indicate that it wasn't passed.

### v0.2.2

This release includes no changes to the code base.

* Addresses issue [`#11`]( https://github.com/4awpawz/buster/issues/11) which seeks to lockdown all project dependencies including descendants using NPM's `shrinkwrap`.

### v0.2.1

Major and minor bug fixes - includes but not limited to the following:

* Addresses issue [`10`](https://github.com/4awpawz/buster/issues/10) which would cause buster to fail when reading command line configuration data belonging to the application that launched it with paramsConfig.

* Addresses issue [`#9`](https://github.com/4awpawz/buster/issues/9) which would sometimes cause `restore` to fail. This fix totally replaces the one introduced in v0.2.0, and now handles the issue earlier in the restore processing cycle.

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

## Copyright And License

Copyright &copy; 2018, `Jeffrey Schwartz`. Released under the `MIT license`.