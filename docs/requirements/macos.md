# Installation under macOS
In a terminal run these

## [Xcode](https://developer.apple.com/xcode/)
Xcode Command Line Tools are the basics

```shell
xcode-select --install
```



## [Homebrew](https://brew.sh)
Homebrew is the entry point to install many tools

```shell
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

#### Image processors ( [GraphicsMagick](http://www.graphicsmagick.org) / [ImageMagick](https://www.imagemagick.org) )
These are used to manipulate images for the iconography

```shell
brew install graphicsmagick
brew install imagemagick --with-webp
```



## [Ruby](https://www.ruby-lang.org) _[deprecated]_
Ruby was used solely to build SCSS

```shell
brew install ruby
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
brew install node
```

#### [nwayo CLI](https://absolunet.github.io/nwayo)
Well duh...

```shell
npm install -g @absolunet/nwayo-cli
```

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
