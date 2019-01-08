<p align="center">
	<img src="https://github.com/absolunet/nwayo/raw/master/ressources/images/nwayo.png" width="250" height="250" alt="nwayo">
</p>
<h1 align="center"><strong>nwayo</strong></h1>
<p align="center">/nwajo/ (haitian creole) The tough central part of various fruits, containing the seeds.</p>

[![npm](https://img.shields.io/npm/v/@absolunet/nwayo-workflow.svg)](https://www.npmjs.com/package/@absolunet/nwayo-workflow)
[![Travis CI](https://api.travis-ci.org/absolunet/nwayo.svg?branch=master)](https://travis-ci.org/absolunet/nwayo/builds)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

<br>

## What is nwayo ?
- A completely hackable and extendable front end boilerplate
- A multi-theme, multi-site, multi-CMS front end framework
- A back end agnostic environment



## Requirements (All latest) - [Installation guide](documentation/requirements)
- [Node.js](https://nodejs.org) ([nwayo CLI](https://www.npmjs.com/package/@absolunet/nwayo-cli))
- [GraphicsMagick](http://www.graphicsmagick.org) / [ImageMagick](https://www.imagemagick.org)



## Get started
Run in your project root folder
```shell
# Get boilerplate
npx @absolunet/nwayo-grow-project

# Install CLI
npm install -g @absolunet/nwayo-cli

# Install dependencies
nwayo install workflow
nwayo install vendors

# Build
nwayo rebuild
```



## Tools &nbsp; <img src="https://github.com/absolunet/nwayo/raw/master/ressources/images/vendors.png" width="525" height="30" alt="nwayo vendors">
nwayo is HTML5-ready and uses [gulp](https://gulpjs.com) as a build system

- Based (but not mandatory) on [Zurb Foundation](https://foundation.zurb.com)
- Uses [Bower](https://bower.io) as dependencies manager and [EditorConfig](https://editorconfig.org) for consistency

#### Styling
- CSS3-ready via [Autoprefixer](https://github.com/postcss/autoprefixer) and linted via [stylelint](https://stylelint.io)
- Comes with [Sass](https://sass-lang.com), built via [Dart Sass](https://www.npmjs.com/package/dart-sass)
- Minifies with [cssnano](https://cssnano.co)

#### Scripting
- ES2019-ready via [Babel](https://babeljs.io) and linted via [ESLint](https://eslint.org)
- Comes with [jQuery](https://jquery.com), [Modernizr](https://modernizr.com), [Lodash](https://lodash.com), [pinki](https://github.com/absolunet/pinki), [JsRender](https://www.jsviews.com), [kafe](https://absolunet.github.io/kafe/)
- Builds with [gulp-include](https://www.npmjs.com/package/@absolunet/gulp-include) and is minified with [UglifyJS](http://lisperator.net/uglifyjs)

#### Other
- Optimizes images via [gifsicle](https://www.lcdf.org/gifsicle), [jpegtran](http://libjpeg-turbo.virtualgl.org), [optipng](http://optipng.sourceforge.net), [svgo](https://github.com/svg/svgo)
- Generates iconography via [GraphicsMagick](http://www.graphicsmagick.org), [ImageMagick](https://www.imagemagick.org)



## Tried and tested
Currently deployed on 200+ sites including:
- [Drupal](https://www.drupal.org)
- [Wordpress](https://wordpress.org)
- [Symfony](https://symfony.com)
- [Magento 1 & 2 (On Premise & Cloud)](https://magento.com)
- [Sitecore](https://www.sitecore.net)
- [Insite (On Premise & Cloud)](https://www.insitesoft.com)
- [Shopify](https://www.shopify.ca)

## Extensions
Multiple extensions [available](https://www.npmjs.com/search?q=keywords:nwayo-extension)


[//]: # (Doc)

## Packages

| Package | Version | Description |
|---|---|---|
| **[@absolunet/nwayo-workflow](packages/workflow)** | [![npm](https://img.shields.io/npm/v/@absolunet/nwayo-workflow.svg)](https://www.npmjs.com/package/@absolunet/nwayo-workflow) | Workflow where all the magic happens |
| **[@absolunet/nwayo-cli](packages/cli)** | [![npm](https://img.shields.io/npm/v/@absolunet/nwayo-cli.svg)](https://www.npmjs.com/package/@absolunet/nwayo-cli) | CLI |
| [@absolunet/nwayo-grow-project](packages/grow-project) | [![npm](https://img.shields.io/npm/v/@absolunet/nwayo-grow-project.svg)](https://www.npmjs.com/package/@absolunet/nwayo-grow-project) | Boilerplate generator for nwayo project |
| [@absolunet/nwayo-grow-extension](packages/grow-extension) | [![npm](https://img.shields.io/npm/v/@absolunet/nwayo-grow-extension.svg)](https://www.npmjs.com/package/@absolunet/nwayo-grow-extension) | Boilerplate generator for nwayo extension |
| Bower: **[nwayo-toolbox](toolbox)** | ![bower](https://img.shields.io/bower/v/nwayo-toolbox.svg) | Toolbox with SCSS/JS helpers |

## Documentation
- [Full documentation](https://absolunet.github.io/nwayo) ([source](documentation))  &nbsp; &nbsp; _[in progress...]_
- [CodePen examples](https://codepen.io/collection/XJWozK/)

[//]: # (/Doc)


## Release history
See the [releases](https://github.com/absolunet/nwayo/releases).

## Contributing
[Issues](https://github.com/absolunet/nwayo/issues) | [Pull requests](https://github.com/absolunet/nwayo/pulls)


[//]: # (Doc)

## License
MIT © [Absolunet](https://absolunet.com)

[//]: # (/Doc)
