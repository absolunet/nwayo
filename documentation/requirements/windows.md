# Installation under Windows
> These are the tools needed for the nwayo workflow

> Run these **AS AN ADMINISTRATOR** in a command prompt

#### [Chocolatey](https://chocolatey.org/)
Chocolatey is the entry point to install many tools

```shell
@"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"
```


#### [Node.js](https://nodejs.org)
Node.js is the backbone of the workflow

```shell
choco install nodejs.install --confirm
```

> **IMPORTANT:** Restart command prompt


#### [Windows-Build-Tools](https://github.com/felixrieseberg/windows-build-tools)
Used by Fibers among others to compile native Node.js modules

```shell
npm install -g windows-build-tools
```

> **IMPORTANT:** You might need a couple of `Ctrl+C` after Python is installed to complete the installation


#### nwayo CLI
Well duh...

```shell
npm install -g @absolunet/nwayo-cli
```



## Older nwayo versions
> If your project uses an older version of nwayo you need to install these

#### 3.7.x and older - [GraphicsMagick](http://www.graphicsmagick.org) and [ImageMagick](https://www.imagemagick.org)
GraphicsMagick and ImageMagick were used to manipulate images for the iconography

```shell
choco install graphicsmagick --confirm
choco install imagemagick.app -packageparameters legacysupport=true --confirm
```


#### 3.5.x and older - [Ruby](https://www.ruby-lang.org)
Ruby was used to build SCSS

```shell
choco install ruby --confirm
chcp 1252
```

> **IMPORTANT:** Restart command prompt

```shell
gem source -a https://rubygems.org/
```


#### 3.5.x and older - [Sass](https://sass-lang.com)
Ruby Sass was used to build SCSS

```shell
gem install sass
```


#### 3.3.x and older - [SCSS-Lint](https://github.com/causes/scss-lint)
SCSS-Lint was used as a SCSS linter

```shell
gem install scss_lint
```


#### prior to 3.0.0 - [JSHint](http://jshint.com)
JSHint was used as a JS linter

```shell
npm install -g jshint
```

#### prior to 3.0.0 - [JSCS](https://www.npmjs.com/package/jscs)
JSCS was used as a JS linter

```shell
npm install -g jscs
```
