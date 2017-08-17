# Installation de nwayo sous OSX
Ouvrir un terminal et exécuter les commandes suivantes :

## [Xcode](https://developer.apple.com/xcode/)
```bash
xcode-select --install
```

## [Homebrew](http://brew.sh)
```bash
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

## Homebrew formulas
```bash
# Image processors (http://www.graphicsmagick.org / http://www.imagemagick.org)
brew install graphicsmagick
brew install imagemagick --with-webp

# Ruby (https://www.ruby-lang.org)
brew install ruby

# Node.js (http://nodejs.org)
brew install node
```

## [RubyGems](https://rubygems.org/)
```bash
# Sass (http://sass-lang.com)
gem install sass

# Compass (http://compass-style.org)
gem install compass

# SCSS-Lint (https://github.com/causes/scss-lint)
gem install scss_lint
```

## [Node packages](https://www.npmjs.com/)
```bash
# Bower (http://bower.io)
npm install bower -g

# JSHint (http://jshint.com/)
npm install jshint -g

# JSCS (http://jscs.info/)
npm install jscs -g

# nwayo (http://absolunet.github.io/nwayo)
npm install nwayo -g
```