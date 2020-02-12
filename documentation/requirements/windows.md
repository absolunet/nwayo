# Installation under Windows
In a command prompt **AS AN ADMINISTRATOR** run these

## [Chocolatey](https://chocolatey.org/)
Chocolatey is the entry point to install many tools

```shell
@"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"
```

#### Image processors ( [GraphicsMagick](http://www.graphicsmagick.org) / [ImageMagick](https://www.imagemagick.org) ) _[deprecated]_
These were used to manipulate images for the iconography by nwayo prior to 3.8.0

```shell
choco install graphicsmagick --confirm
choco install imagemagick.app -packageparameters legacysupport=true --confirm
```



## [Ruby](https://www.ruby-lang.org) _[deprecated]_
Ruby was used solely to build SCSS

```shell
choco install ruby --confirm
chcp 1252
```

#### Restart CMD before proceding to the next commands
```shell
gem source -a https://rubygems.org/
```

#### [Sass](https://sass-lang.com) _[deprecated]_
Ruby Sass was originally the native compiler of SCSS and was used by nwayo prior to 3.6.0

```shell
gem install sass
```

#### [SCSS-Lint](https://github.com/causes/scss-lint) _[deprecated]_
SCSS-Lint was the SCSS linter used by nwayo prior to 3.4.0

```shell
gem install scss_lint
```



## [Node.js](https://nodejs.org)
Node.js is the backbone of the workflow

```shell
choco install nodejs.install --confirm
```

#### Restart CMD before proceding to the next commands

#### [nwayo CLI](https://absolunet.github.io/nwayo)
Well duh...

```shell
npm install -g @absolunet/nwayo-cli
```

#### [Windows-Build-Tools](https://github.com/felixrieseberg/windows-build-tools)
Used by Fibers among others to compile native Node modules

```shell
npm install -g windows-build-tools
```

**IMPORTANT:** You might need a couple of `Ctrl+C` after Python is installed to complete the installation

#### [JSHint](http://jshint.com) _[deprecated]_
JSHint was a JS linter used by nwayo prior to 3.0.0

```shell
npm install -g jshint
```

#### [JSCS](https://www.npmjs.com/package/jscs) _[deprecated]_
JSCS was a JS linter used by nwayo prior to 3.0.0

```shell
npm install -g jscs
```
