# Installation under macOS
> These are the tools needed for the nwayo workflow

#### [Xcode](https://developer.apple.com/xcode/)
Xcode Command Line Tools are the basics

```shell
xcode-select --install
```


#### [Homebrew](https://brew.sh)
Homebrew is the entry point to install many tools

```shell
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```


#### [Node.js](https://nodejs.org)
Node.js is the backbone of the workflow

```shell
brew install node
```

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
brew install graphicsmagick
brew install imagemagick --with-webp
```


#### 3.5.x and older - [Ruby](https://www.ruby-lang.org)
Ruby was used to build SCSS

```shell
brew install ruby
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
