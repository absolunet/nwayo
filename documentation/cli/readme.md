# CLI
[View on npm](https://www.npmjs.com/package/@absolunet/nwayo-cli)

The nwayo CLI is essentially a [gulp CLI](https://www.npmjs.com/package/gulp-cli) wrapper with additional commands.


## Installation
```shell
$ npm i -g @absolunet/nwayo-cli
```


## Usage
In any subfolder of the project's root folder, where the `nwayo.yaml` is located

### In each project, install the project's workflow
```shell
$ nwayo install workflow
```

### Then you can run any `nwayo` command
```shell
$ nwayo [...]
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
	- icons-touch
	- icons-icon
	- icons-large
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
`nwayo rebuild [<bundle>] [--prod]`

Rebuilds the entire project from scratch, removing all cache, running all tasks.

Should be run:
 - Whenever tasks behave weirdly to rebuild cached items
 - Files are added or removed
 - Config files are modified

`--prod` flag forces minification ignoring bundle config

**Examples:**
```shell
$ nwayo rebuild

$ nwayo rebuild site

$ nwayo rebuild --prod
```

### watch
`nwayo watch [<bundle>]`

Listens for changes on files under `components` and runs the appropriate tasks.

The `watch` command is build with rapidity in mind so here's what it **DOESN'T** do:
 - Build custom `Modernizr` and `Lodash`
 - Optimize and cache inline images
 - Minify CSS/JS

Whenever `watch` behaves weirdly, restart it and/or run a `rebuild`.

**Examples:**
```shell
$ nwayo watch

$ nwayo watch site
```

### install
`nwayo install [<scope>] [--force]`

Install project dependencies.

The `workflow` scope installs the workflow via `npm`
- By default it uses `npm ci` which is faster but requires a valid `package-lock.json` in sync with the `package.json`
- If the `--force` flag is used, it will use `npm install` and regenerate the `package-lock.json`

The `vendors` scope installs the vendor dependencies via `npm`

**Examples:**
```shell
$ nwayo install workflow

$ nwayo install vendors
```

### doctor
`nwayo doctor`

Analyze project for conformity

Checks npm packages for updates and lists what is outdated.

Checks if the toolbox version is the same as the workflow version.

Check if project follows conventions

**Examples:**
```shell
$ nwayo doctor

  Workflow diagnosis
    ✓  You are cutting edge   (^_^)


  Vendor diagnosis
    ✘  You are a dull blade   ಠ_ಠ

    [@absolunet/kafe] : 3.2.1 → 3.2.4
    [foundation-sites] : 6.4.0 → 6.5.1
    [imagesloaded] : 4.1.3 → 4.1.4
    [jquery] : 3.2.1 → 3.3.1
    [jsrender] : 0.9.86 → 1.0.0
    [slick.js] : 1.6.0 → 1.8.1


  Synchronization diagnosis
    ✓  You are cutting edge   (^_^)
```

## \<bundle\> param

If a bundle is specified, the command will be run against this bundle only.

If a sub-bundle is specified, the command will be run against this sub-bundle only.

**Examples:**
```shell
$ nwayo rebuild site

$ nwayo watch site:editor
```


## CLI

### update
`nwayo update`

Updates nwayo CLI if needs updating or reinstalls it otherwise

**Example:**
```shell
$ nwayo update
```

### outdated
`nwayo outdated`

Outputs if nwayo CLI needs an update

**Example:**
```shell
$ nwayo outdated

   ╭─────────────────────────────────────────────────╮
   │                                                 │
   │         Update available 3.5.2 → 3.6.0          │
   │           Run nwayo update to update            │
   │                                                 │
   ╰─────────────────────────────────────────────────╯

```

### grow
`nwayo grow`

Generate new project or extension

**Example:**
```shell
$ nwayo grow
```

or

```shell
$ nwayo grow extension
```


## -v or --version
`nwayo --version`

Outputs nwayo CLI's version

**Example:**
```shell
$ nwayo --version
1.1.1
```

### -h or --help
`nwayo --help`

Outputs nwayo CLI's manual

**Example:**
```shell
$ nwayo --help

  🌰  /nwajo/ (haitian creole) The tough central part of various fruits, containing the seeds.

  Usage: nwayo <command>

  Project
  run <task> [<bundle>]           Run a task ex:[assets|icons|local|scripts|styles]
  rebuild [<bundle>] [--prod]     Rebuild the entire project from scratch
  watch [<bundle>]                Listens for changes on files and run appropriate tasks
  install [<scope>] [--force]     Install dependencies ex:[workflow|vendors]
  doctor                          Analyze project for conformity

  Global
  update                          Update the CLI
  outdated                        Check if CLI is outdated
  grow [extension]                Generate new project or extension
  -h, --help                      Show help
  -v, --version                   Show CLI version
  --pronounce                     Listen to nwayo pronunciation

       cli@3.6.0 /usr/local/bin/nwayo
  workflow@3.6.0 /Users/absolunet/www/project-name/nwayo/node_modules/@absolunet/nwayo-workflow
```

### --pronounce
`nwayo --pronounce`

Uses macOS `say` to show how nwayo sounds
