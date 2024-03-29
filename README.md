<p align="center">
	<img src="https://github.com/absolunet/nwayo/raw/production/ressources/images/nwayo.png" width="250" height="250" alt="nwayo">
</p>
<h1 align="center"><strong>nwayo</strong></h1>
<p align="center">/nwajo/ (haitian creole) The tough central part of various fruits, containing the seeds.</p>

[![npm](https://img.shields.io/npm/v/@absolunet/nwayo-workflow.svg)](https://www.npmjs.com/package/@absolunet/nwayo-workflow)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

<br>

## What is nwayo ?
- A completely hackable and extendable front end boilerplate
- A multi-theme, multi-site, multi-CMS front end framework
- A back end agnostic environment



## Requirements
- [Node.js](https://nodejs.org)
- [nwayo CLI](https://www.npmjs.com/package/@absolunet/nwayo-cli)



## Get started
Run in your project root folder
```shell
# Get boilerplate
npx @absolunet/nwayo-grow-project

# Install workflow and vendor (in nwayo root folder)
npm install

# Install CLI
npm install -g @absolunet/nwayo-cli

# Build (in nwayo root folder)
nwayo rebuild
```



## Tools &nbsp; <img src="https://github.com/absolunet/nwayo/raw/production/ressources/images/vendors.png" width="375" alt="nwayo vendors">
nwayo is HTML5 ready and uses [gulp](https://gulpjs.com) as a build system

- Based (but not mandatory) on [Zurb Foundation](https://foundation.zurb.com)
- Uses [npm](https://www.npmjs.com) as dependencies manager and [EditorConfig](https://editorconfig.org) for consistency

#### Styling
- CSS3 ready via [Autoprefixer](https://github.com/postcss/autoprefixer) and linted via [stylelint](https://stylelint.io)
- Comes with [Sass](https://sass-lang.com), built via [Dart Sass](https://www.npmjs.com/package/dart-sass)
- Minifies with [cssnano](https://cssnano.co)

#### Scripting
- ES6+ ready via [Babel](https://babeljs.io) and linted via [ESLint](https://eslint.org)
- Comes with [jQuery](https://jquery.com), [Modernizr](https://modernizr.com), [Lodash](https://lodash.com), [pinki](https://github.com/absolunet/pinki), [JsRender](https://www.jsviews.com), [kafe](https://documentation.absolunet.com/kafe/)
- Builds with [gulp-include](https://www.npmjs.com/package/@absolunet/gulp-include) and is minified with [UglifyJS](http://lisperator.net/uglifyjs)

#### Other
- Optimizes images via [gifsicle](https://www.lcdf.org/gifsicle), [MozJPEG](https://github.com/mozilla/mozjpeg), [optipng](http://optipng.sourceforge.net), [svgo](https://github.com/svg/svgo)
- Generates iconography via [Jimp](https://github.com/oliver-moran/jimp), [to-ico](https://github.com/kevva/to-ico)



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
| **[@absolunet/nwayo-toolbox](packages/toolbox)** | [![npm](https://img.shields.io/npm/v/@absolunet/nwayo-toolbox.svg)](https://www.npmjs.com/package/@absolunet/nwayo-toolbox) | Toolbox with SCSS/JS helpers |
| **[@absolunet/nwayo-cli](packages/cli)** | [![npm](https://img.shields.io/npm/v/@absolunet/nwayo-cli.svg)](https://www.npmjs.com/package/@absolunet/nwayo-cli) | CLI |
| [@absolunet/nwayo-grow-project](packages/grow-project) | [![npm](https://img.shields.io/npm/v/@absolunet/nwayo-grow-project.svg)](https://www.npmjs.com/package/@absolunet/nwayo-grow-project) | Boilerplate generator for nwayo project |
| [@absolunet/nwayo-grow-extension](packages/grow-extension) | [![npm](https://img.shields.io/npm/v/@absolunet/nwayo-grow-extension.svg)](https://www.npmjs.com/package/@absolunet/nwayo-grow-extension) | Boilerplate generator for nwayo extension |

## Documentation
- [Full documentation](https://documentation.absolunet.com/nwayo) ([source](documentation))  &nbsp; &nbsp; _[in progress...]_
- [Toolbox styles documentation](https://documentation.absolunet.com/nwayo/toolbox/styles) (generated from [comments](http://sassdoc.com/) directly inside the [source code](packages/toolbox/styles))
- [CodePen examples](https://codepen.io/collection/XJWozK/)

[//]: # (/Doc)


## Release history

See the [Changelog](CHANGELOG.md) to see what has changed.


## Contribute

See the [Contributing Guidelines](CONTRIBUTING.md) for ways to get started.

See the [Support Guide](SUPPORT.md) for ways to get help.

See the [Security Policy](SECURITY.md) for sharing vulnerability reports.

This project has a [Code of Conduct](CODE_OF_CONDUCT.md).
By interacting with this repository, organization, or community you agree to abide by its terms.


[//]: # (Doc)

## License
[MIT](LICENSE) © [Absolunet](https://absolunet.com)

[//]: # (/Doc)
