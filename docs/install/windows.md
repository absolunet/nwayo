# Installation de nwayo sous Windows
**Ouvrir un invite de commandes en mode Administrateur**

## [Chocolatey Packages](https://chocolatey.org/)
```winbatch
# Chocolatey (https://chocolatey.org/)
@"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"
choco install chocolatey --confirm

# cURL (http://curl.haxx.se/)
choco install curl --confirm

# Git (http://git-scm.com / https://git-lfs.github.com)
choco install git.install -params '"/GitAndUnixToolsOnPath"' --confirm
choco install git-lfs.install --confirm

# Image processors (http://www.graphicsmagick.org / http://www.imagemagick.org)
choco install graphicsmagick --confirm
choco install imagemagick.app --version 6.9.9.7 --confirm

# Ruby (https://www.ruby-lang.org)
choco install ruby --confirm

# Node.js (http://nodejs.org)
choco install nodejs.install --confirm
```

## [RubyGems](https://rubygems.org/)
```winbatch
# Set http source
chcp 1252
gem source -a http://rubygems.org/

# Sass (http://sass-lang.com)
gem install sass -v 3.4.25

# Compass (http://compass-style.org)
gem install compass

# SCSS-Lint (https://github.com/causes/scss-lint)
gem install scss_lint
```

## [Node packages](https://www.npmjs.com/)
```winbatch
# Bower (http://bower.io)
npm install bower -g

# JSHint (http://jshint.com/)
npm install jshint -g

# JSCS (http://jscs.info/)
npm install jscs -g

# nwayo (http://absolunet.github.io/nwayo)
npm install nwayo -g
```