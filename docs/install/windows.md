# Installation de nwayo sous Windows
Ouvrir un invite de commandes en mode administrateur et exécuter les commandes suivantes :

## [Chocolatey](https://chocolatey.org/)
```sh
@"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"
```

## Chocolatey Packages
```sh
# Image processors (http://www.graphicsmagick.org / http://www.imagemagick.org)
choco install graphicsmagick --confirm
choco install imagemagick.app -packageparameters legacysupport=true --confirm

# Ruby (https://www.ruby-lang.org)
choco install ruby --confirm

# Node.js (http://nodejs.org)
choco install nodejs.install --confirm
```

## [RubyGems](https://rubygems.org/)
```sh
# Set http source
chcp 1252
gem source -a http://rubygems.org/

# Sass (http://sass-lang.com)
gem install sass

# SCSS-Lint (https://github.com/causes/scss-lint)
gem install scss_lint
```

## [Node packages](https://www.npmjs.com/)
```sh
# Bower (http://bower.io)
npm install bower -g

# nwayo (http://absolunet.github.io/nwayo)
npm install @absolunet/nwayo-cli -g

# JSHint (http://jshint.com/) [Legacy]
npm install jshint -g

# JSCS (http://jscs.info/) [Legacy]
npm install jscs -g
```
