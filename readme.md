<p align="center">
	<img src="https://github.com/absolunet/nwayo/raw/master/ressources/images/nwayo.png" width="250" height="250" alt="nwayo">
</p>
<h1 align="center"><strong>nwayo</strong></h1>
<p align="center">/nwajo/ (haitian creole) The tough central part of various fruits, containing the seeds.</p>

[![NPM version](https://img.shields.io/npm/v/@absolunet/nwayo-workflow.svg)](https://www.npmjs.com/package/@absolunet/nwayo-workflow)
[![Travis build](https://api.travis-ci.org/absolunet/nwayo.svg?branch=master)](https://travis-ci.org/absolunet/nwayo/builds)
[![Dependencies](https://david-dm.org/absolunet/nwayo/status.svg)](https://david-dm.org/absolunet/nwayo)
[![Dev dependencies](https://david-dm.org/absolunet/nwayo/dev-status.svg)](https://david-dm.org/absolunet/nwayo?type=dev)
<br>

## What is nwayo ?
- A completely hackable front end boilerplate
- A multi-theme, multi-site, multi-cms front end framework
- A back-end agnostic environment



## Requirements (All latest) - [Installation guide](docs/install)
- [Node.js](//nodejs.org) ([Bower](//bower.io), [nwayo](//www.npmjs.com/package/@absolunet/nwayo-cli))
- [Ruby](//www.ruby-lang.org) ([Sass](http://sass-lang.com))
- [GraphicsMagick](http://www.graphicsmagick.org) / [ImageMagick](//www.imagemagick.org)



## Get started
 - Get the files under [boilerplate](boilerplate)
 - Replace `PROJECT_NAME` in `bower.json` and `package.json` with your project's name
 - Rename `PROJECT_NAME.sublime-project` with your project's name

Run in nwayo root folder
```shell
npm install
bower install
nwayo rebuild
```



## Tools &nbsp; <img src="https://github.com/absolunet/nwayo/raw/master/ressources/images/vendors.png" width="600" height="30" alt="nwayo vendors">
`nwayo` is HTML5-ready and uses [gulp](http://gulpjs.com) as a build system

- Based (but not mandatory) on [Zurb Foundation](//foundation.zurb.com)
- Uses [Bower](//bower.io) as dependencies manager and [EditorConfig](http://editorconfig.org) for consistency

#### Styling
- CSS3-ready via [Autoprefixer](//github.com/postcss/autoprefixer) and linted via [stylelint](//stylelint.io/)
- Comes with [Sass](http://sass-lang.com)
- Minifies with [cssnano](http://cssnano.co)

#### Scripting
- ES2018-ready via [Babel](//babeljs.io) and linted via [ESLint](http://eslint.org)
- Comes with [jQuery](//jquery.com), [Modernizr](//modernizr.com), [lodash](//lodash.com), [PubSubJs](//github.com/mroderick/PubSubJS), [JsRender](//www.jsviews.com), [kafe](http://absolunet.github.io/kafe)
- Builds with [gulp-include](//www.npmjs.com/package/@absolunet/gulp-include) and is minified with [UglifyJS](http://lisperator.net/uglifyjs)

#### Other
- Optimizes images via [gifsicle](//www.lcdf.org/gifsicle), [jpegtran](http://libjpeg-turbo.virtualgl.org), [optipng](http://optipng.sourceforge.net), [svgo](//github.com/svg/svgo)
- Generates iconography via [GraphicsMagick](http://www.graphicsmagick.org), [ImageMagick](//www.imagemagick.org)
- Optimized for [Sublime Text 3](//www.sublimetext.com) with [SublimeLinter 3](http://www.sublimelinter.com)



## Tried and tested
 - Currently deployed on 200+ sites
 - Front end to [Drupal](//www.drupal.org), [Wordpress](//wordpress.org), [Symfony](//symfony.com), [Magento 1 & 2](//magento.com), [Sitecore](//www.sitecore.net), [Insite](http://www.insitesoft.com) environments

## Components
Multiple component boilerplates [available](//github.com/absolunet/nwayo-components)

## Documentation
*Coming soon...*

Consult [this folder](docs) in the meantime

## Release history
See the [releases](//github.com/absolunet/nwayo/releases).

## Contributing
[Issues](//github.com/absolunet/nwayo/issues) | [Pull requests](//github.com/absolunet/nwayo/pulls)

## License
MIT © [Absolunet](https://absolunet.com)
