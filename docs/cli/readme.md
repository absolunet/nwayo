
# CLI  [![NPM version](https://img.shields.io/npm/v/@absolunet/nwayo-cli.svg)](https://www.npmjs.com/package/@absolunet/nwayo-cli)
The nwayo CLI is essentially a [gulp CLI](https://www.npmjs.com/package/gulp-cli) wrapper with additional commands.


## Installation
```shell
$ npm install @absolunet/nwayo-cli -g
```


## Usage
In each project under the `nwayo` folder, install the project's Node.js packages
```shell
$ npm install
```

In any subfolder of the project's root folder, where the `nwayo.yaml` is located
```shell
$ nwayo ...
```


## Commands

### run
`nwayo run <task> [<bundle>]`

Runs a specific task and its dependencies.

**Available tasks:**
- assets
	- assets-fonts
	- assets-images-optimization
	- assets-images-highdensity
	- assets-raw
	- assets-images
- icons
	- icons-favicon
	- icons-share
	- icons-tile
- local
	- local-constants
- scripts
	- scripts-lint
	- scripts-constants
	- scripts-vendors
	- scripts-compile
- styles
	- styles-images
	- styles-lint
	- styles-constants
	- styles-compile
- rebuild-ss

**Examples:**
```shell
$ nwayo run styles

$ nwayo run scripts-lint site
```


### rebuild
`nwayo rebuild [<bundle>]`

Rebuilds the entire project from scratch, removing all cache, running all tasks.

Should be run:
 - Whenever tasks behave weirdly to rebuild cached items
 - Files are added or removed
 - Config files are modified

**Examples:**
```shell
$ nwayo rebuild

$ nwayo rebuild site
```

### watch
`nwayo watch [<bundle>]`

Listens for changes on files under `components` and runs the appropriate tasks.

The `watch` command is build with rapidity in mind so here's what it **DOESN'T** do:
 - Build custom `Modernizr` and `LoDash`
 - Optimize and cache inline images
 - Minify CSS/JS

Whenever `watch` behaves weirdly, restart it and/or run a `rebuild`.

**Examples:**
```shell
$ nwayo watch

$ nwayo watch site
```

### doctor
`nwayo doctor`

Checks Node.js / Bower packages for updates and lists what is outdated.

**Examples:**
```shell
$ nwayo doctor

  Node diagnosis
    You are cutting edge   (^_^)


  Bower diagnosis
    You are a dull blade   ಠ_ಠ

    [foundation-sites] : 6.3.1 ➝  6.4.0
    [imagesloaded] : 4.1.3 ➝  4.1.4
    [jquery] : 3.2.1 ➝  3.3.1
    [jsrender] : 0.9.86 ➝  0.9.87
    [kafe] : 3.2.1 ➝  3.2.4
    [pubsub-js] : 1.5.7 ➝  1.6.0
    [slick.js] : 1.6.0 ➝  1.8.1
```

### \<bundle\> param

If a bundle is specified, the command will be run against this bundle only.

If a sub-bundle is specified, the command will be run against this sub-bundle only.

**Examples:**
```shell
$ nwayo rebuild site

$ nwayo watch site:editor
```


## Flags

### -v or --version
`nwayo --version`

Outputs nwayo CLI's version

**Example:**
```shell
$ nwayo --version
1.0.0
```

### -h or --help
`nwayo --help`

Outputs nwayo CLI's manual

**Example:**
```shell
$ nwayo --help

Usage: nwayo <command>

 Project commands
 nwayo run [<task> [<bundle>]]   Run a task
 nwayo rebuild [<bundle>]        Run rebuild task
 nwayo watch [<bundle>]          Run watch task
 nwayo doctor                    Diagnose project dependencies

 Flag commands
 nwayo --version        Get cli version
 nwayo --pronounce      How to pronounce

      cli@1.0.0 /usr/local/bin/nwayo
 workflow@3.3.3 /Users/absolunet/www/project-name/nwayo/node_modules/@absolunet/nwayo-workflow/
```

### --pronounce
`nwayo --pronounce`

Uses macOS `say` to show how nwayo sounds
