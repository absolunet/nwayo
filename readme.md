<p align="center">
	<img src="https://github.com/absolunet/nwayo/raw/master/ressources/images/nwayo.png" width="250" height="250" alt="nwayo">
</p>
<h1 align="center"><strong>nwayo</strong></h1>
<p align="center">/nwajo/ (haitian creole) The tough central part of various fruits, containing the seeds.</p>

[![npm](https://img.shields.io/npm/v/@absolunet/nwayo-workflow.svg)](https://www.npmjs.com/package/@absolunet/nwayo-workflow)
[![npm dependencies](https://david-dm.org/absolunet/nwayo/status.svg?path=workflow)](https://david-dm.org/absolunet/nwayo?path=workflow)
[![npms](https://badges.npms.io/%40absolunet%2Fnwayo-workflow.svg)](https://npms.io/search?q=%40absolunet%2Fnwayo-workflow)
[![Travis CI](https://api.travis-ci.org/absolunet/nwayo.svg?branch=master)](https://travis-ci.org/absolunet/nwayo/builds)

[![Code style ESLint](https://img.shields.io/badge/code_style-ESLint_@absolunet/node-659d32.svg)](https://github.com/absolunet/eslint-config-node)
[![Code style ESLint](https://img.shields.io/badge/code_style-ESLint_@absolunet/nwayo-659d32.svg)](https://github.com/absolunet/eslint-config-nwayo)
[![Code style stylelint](https://img.shields.io/badge/code_style-stylelint_@absolunet/nwayo-659d32.svg)](https://github.com/absolunet/stylelint-config-nwayo)

<br>

## What is nwayo ?
- A completely hackable front end boilerplate
- A multi-theme, multi-site, multi-CMS front end framework
- A back end agnostic environment



## Requirements (All latest) - [Installation guide](docs-sources/requirements)
- [Node.js](https://nodejs.org) ([nwayo CLI](https://www.npmjs.com/package/@absolunet/nwayo-cli))
- [GraphicsMagick](http://www.graphicsmagick.org) / [ImageMagick](https://www.imagemagick.org)



## Get started
 - Get the files under [boilerplate](boilerplate)
 - Replace `PROJECT_NAME` in `bower.json` and `package.json` with your project's name

Run in nwayo root folder
```shell
nwayo install workflow
nwayo install vendors
nwayo rebuild
```



## Tools &nbsp; <img src="https://github.com/absolunet/nwayo/raw/master/ressources/images/vendors.png" width="600" height="30" alt="nwayo vendors">
`nwayo` is HTML5-ready and uses [gulp](https://gulpjs.com) as a build system

- Based (but not mandatory) on [Zurb Foundation](https://foundation.zurb.com)
- Uses [Bower](https://bower.io) as dependencies manager and [EditorConfig](https://editorconfig.org) for consistency

#### Styling
- CSS3-ready via [Autoprefixer](https://github.com/postcss/autoprefixer) and linted via [stylelint](https://stylelint.io)
- Comes with [Sass](https://sass-lang.com)
- Minifies with [cssnano](https://cssnano.co)

#### Scripting
- ES2018-ready via [Babel](https://babeljs.io) and linted via [ESLint](https://eslint.org)
- Comes with [jQuery](https://jquery.com), [Modernizr](https://modernizr.com), [Lodash](https://lodash.com), [pinki](https://github.com/absolunet/pinki), [JsRender](https://www.jsviews.com), [kafe](https://absolunet.github.io/kafe/)
- Builds with [gulp-include](https://www.npmjs.com/package/@absolunet/gulp-include) and is minified with [UglifyJS](http://lisperator.net/uglifyjs)

#### Other
- Optimizes images via [gifsicle](https://www.lcdf.org/gifsicle), [jpegtran](http://libjpeg-turbo.virtualgl.org), [optipng](http://optipng.sourceforge.net), [svgo](https://github.com/svg/svgo)
- Generates iconography via [GraphicsMagick](http://www.graphicsmagick.org), [ImageMagick](https://www.imagemagick.org)
- Optimized for [Atom](https://atom.io) with [AtomLinter](https://atomlinter.github.io)



## Tried and tested
Currently deployed on 200+ sites including:
- [Drupal](https://www.drupal.org)
- [Wordpress](https://wordpress.org)
- [Symfony](https://symfony.com)
- [Magento 1 & 2 (On Premise & Cloud)](https://magento.com)
- [Sitecore](https://www.sitecore.net)
- [Insite (On Premise & Cloud)](https://www.insitesoft.com)
- [Shopify](https://www.shopify.ca)

## Components
Multiple component boilerplates [available](https://github.com/absolunet/nwayo-components)

[//]: # (Doc)

## Documentation
- [Full documentation](https://absolunet.github.io/nwayo) ([source](docs-sources))  &nbsp; &nbsp; _[in progress...]_
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
