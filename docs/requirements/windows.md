# Installation under Windows
In a command prompt **AS AN ADMINISTRATOR** run these

## [Chocolatey](https://chocolatey.org/)
Chocolatey is the entry point to install many tools

```shell
@"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"
```

#### Image processors ( [GraphicsMagick](http://www.graphicsmagick.org) / [ImageMagick](http://www.imagemagick.org) )
These are used to manipulate images for the iconography

```shell
choco install graphicsmagick --confirm
choco install imagemagick.app -packageparameters legacysupport=true --confirm
```



## [Ruby](https://www.ruby-lang.org)
Ruby is used solely to build SCSS

```shell
choco install ruby --confirm
chcp 1252
gem source -a http://rubygems.org/
```

#### [Sass](http://sass-lang.com)
Sass is the original native compiler of SCSS

```shell
gem install sass
```

#### [SCSS-Lint](https://github.com/causes/scss-lint) _[deprecated]_
SCSS-Lint was the SCSS linter used by nwayo prior to 3.5.0

```shell
gem install scss_lint
```



## [Node.js](http://nodejs.org)
Node.js is the backbone of the workflow

```shell
choco install nodejs.install --confirm
```

#### [Bower](http://bower.io)
Bower is used for front end plugins dependencies

```shell
npm install bower -g
```

#### [nwayo CLI](http://absolunet.github.io/nwayo)
Well duh...

```shell
npm install @absolunet/nwayo-cli -g
```

#### [JSHint](http://jshint.com/) _[deprecated]_
JSHint was a JS linter used by nwayo prior to 3.0.0

```shell
npm install jshint -g
```

#### [JSCS](http://jscs.info/) _[deprecated]_
JSCS was a JS linter used by nwayo prior to 3.0.0

```shell
npm install jscs -g
```
