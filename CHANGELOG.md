# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).






## [Unreleased]
### Fixed
- Fix `scripts-lint` on `watch` that would stop on lint error



## [3.9.1] - 2022-03-28
### Changed
- Update documentation

### Removed
- Remove TravisCI

### Fixed
- Fixes SVG converting endlessly



## [3.9.0] - 2022-03-22
### Changed
- Maintenance updates



## [3.9.0-beta.2] - 2022-02-17
### Changed
- Corrections to monorepo manager
- Maintenance updates

### Fixed
- Fixes bad paths in Windows during SASS compilation



## [3.9.0-beta.1] - 2021-12-20
### Added
- Add Node.js 16 support

### Changed
- Change default stylelint config to `@absolunet/stylelint-config-scss`
- Move linters packages to `peerDependencies` for manual updates
- Update to Autoprefixer 10.x
- Update to cssnano 5.x
- Update to ESLint 8.x
- Update to Foundation 6.7.x
- Update to SASS 1.45.x
- Linters updates
- `nwayo.yaml` file must now be in root `nwayo` folder
- Convert empty image from gif to png
- Workflow installation now installs vendor via a `postinstall`
- Documentation updates
- Maintenance updates

### Removed
- Remove `fibers` dependency
- Remove CLI support for nwayo < 3.3.x (legacy mode)
- Remove CLI support to be run outside root `nwayo` folder
- Remove CLI `doctor` command
- Remove CLI `install` command
- Remove `___nwayo-recommended___` in boilerplate vendors



## [3.8.2] - 2020-03-23
### Changed
- Maintenance updates

### Fixed
- Fixes 'Could not find plugin "proposal-numeric-separator"' with `@babel/preset-env` update



## [3.8.1] - 2020-02-20
### Changed
- Update ESLint config to 1.5.1
- Maintenance updates

### Fixed
- Broken CLI `update`



## [3.8.0] - 2020-02-13
### Changed
- Replace ImageMagick / GraphicsMagick with Node.js native `Jimp` and `to-ico`
- Update ESLint config to 1.5.0
- Update stylelint config to 1.3.1
- Maintenance updates

### Removed
- Removed `$konstan-*` SCSS variables that have been deprecated since 3.6.0



## [3.7.2] - 2020-02-06
### Changed
- Changed hover selection from 'mouse' to 'not-touch'
- Changed jpeg optimization from jpegtran to MozJPEG
- Update to Foundation 6.6.1
- Update to Modernizr 3.9.0
- Maintenance updates

### Fixed
- Script linting works when CLI is called outside `nwayo` directory



## [3.7.1] - 2019-11-05
### Added
- Community resources files
- ESLint now reports useless disables

### Changed
- Switch gulp-cssnano (DEPRECATED) to gulp-postcss
- Switch from Modernizr.touchevents to What Input since it is more accurate
- Update ESLint config to 1.4.4
- Update stylelint config to 1.3.0
- Changes in project boilerplate for consistency and clarity
- Maintenance updates



## [3.7.0] - 2019-06-20
### Changed
- Merge changes from version 3.6.7
- Maintenance updates



## [3.7.0-rc.1] - 2019-05-28
### Added
- Merge changes from version 3.6.6



## [3.7.0-beta.2] - 2019-05-21
### Changed
- Merge changes from version 3.6.5
- Manager update



## [3.7.0-beta.1] - 2019-05-09
### Changed
- Switch from Bower to npm



## [3.6.7] - 2019-06-20
### Fixed
- Autoprefixer use new `overrideBrowserslist` option
- CLI crashes when no `nwayo.yaml` file
- On scripts/styles build, clean only targeted collections if a subbundle is scoped on CLI
- Maintenance updates


## [3.6.6] - 2019-05-28
### Added
- Max ES2019 support
- Add regenerator-runtime for async/await support
- Add `nwayo.yaml` config to influence browser support



## [3.6.5] - 2019-05-21
### Fixed
- Update stylelint to remove `function-calc-no-invalid` rule because it conflicts with SCSS variables



## [3.6.4] - 2019-04-29
### Changed
- Node.js 12 supports



## [3.6.3] - 2019-04-23
### Added
- `~polyfill` custom build with a core-js build for ES6+ polyfills

### Changed
- Switch to gulp-sass and async methods with Fiber



## [3.6.2] - 2019-03-22
### Fixed
- Correct legacy workflow (fss.del deprecated) [Thx asmorissette]
- Correct styles sourcemaps not working
- Force nwayo configuration to be committed by default



## [3.6.1] - 2019-01-08
### Changed
- Maintenance updates

### Fixed
- Unable to resolve asset paths when using nwayo-bg-image-styles mixin ([#48](https://github.com/absolunet/nwayo/issues/48))



## [3.6.0] - 2018-12-19
### Added
- Cloudflare errors sample pages

### Changed
- Cleanup boilerplate



## [3.6.0-rc.4] - 2018-12-07
### Added
- `docs` command

### Changed
- Rename of excluded files from npm pack

### Fixed
- `doctor` corrections



## [3.6.0-rc.3] - 2018-12-04
### Added
- `@absolunet/nwayo-grow-project`
- `@absolunet/nwayo-grow-extension`

### Changed
- Bring back `@absolunet/nwayo-cli`
- Convert repo to lerna
- Maintenance updates

### Fixed
- Lodash scope ([#47](https://github.com/absolunet/nwayo/issues/47))
- No icons ([#49](https://github.com/absolunet/nwayo/issues/49))
- `doctor` not working



## [3.6.0-rc.1] - 2018-11-02
### Added
- Konstan SCSS map ([#45](https://github.com/absolunet/nwayo/issues/45))

### Changed
- Update linters
- Update to Foundation 6.5.0

### Removed
- FastClick
- Foundation 6 mandatory dependency ([#46](https://github.com/absolunet/nwayo/issues/46))



## [3.6.0-beta.6] - 2018-10-12
### Fixed
- Inclusion loop



## [3.6.0-beta.5] - 2018-10-11
### Added
- Extension connector



## [3.6.0-beta.3] - 2018-09-28
### Added
- `doctor` now tries to validate the whole structure of your project *(Warning: Will hurt your feelings)*
- Cache invalidator for resources output via css

### Changed
- Conversion of workflow to an OOP structure
- Documentation moved from gh-pages branch to docs folder

### Fixed
- Cssnano removes browser prefixes ([#43](https://github.com/absolunet/nwayo/issues/43))



## [3.6.0-beta.2] - 2018-07-04
### Changed
- Conversion from Ruby Sass to Dart Sass (Node.js version)



## [3.5.2] - 2018-06-29
### Added
- `outdated` command
- `update` command



## [3.5.1] - 2018-06-22
### Added
- `--force` flag to install command
- Migration documentation



## [3.5.0-rc.5] - 2018-06-18
### Changed
- Bower updates
- Move `app.lazyload` to `toolbox.lazyload`
- ESLint / stylelint update



## [3.5.0-rc.3] - 2018-06-11
### Fixed
- Correction to root path



## [3.5.0-rc.2] - 2018-06-07
### Fixed
- Assets build in multiple bundles now works correctly



## [3.5.0-rc.1] - 2018-06-01
### Fixed
- No more confusion between watch guards (task cannot be restarted until it is completed)
- Better error handling via plumber
- Corrected install vendors for Windows



## [3.5.0-beta.6] - 2018-04-20
### Changed
- Update to pinki 1.0.0



## [3.5.0-beta.5] - 2018-04-09
### Changed
- Replace PubSubJS with pinki



## [3.5.0-beta.4] - 2018-03-26
### Added
- Bash completion



## [3.5.0-beta.3] - 2018-03-15
### Changed
- Optimize startup of tasks

### Fixed
- Correct npm install



## [3.5.0-beta.2] - 2018-03-14
### Fixed
- Remove `npm-shrinkwrap.json` from release



## [3.5.0-beta.1] - 2018-03-13
### Changed
- Update to gulp.js 4
- Rewritten workflow and CLI



## [3.4.3] - 2019-05-15
### Fixed
- Support Node.js 12 *(outdated gulp.js 3.9.1 dependency fixed via npm-shrinkwrap)*



## [3.4.2] - 2018-02-05
### Added
- PubSubJS wrapper



## [3.4.1] - 2018-01-30
### Changed
- Update stylelint config



## [3.4.0] - 2018-01-26
### Changed
- Replace `SCSS-lint` with `stylelint`
- Extract boilerplate/components/nwayo as bower package `nwayo-toolbox`
- `Update to Foundation 6.4`
- Rework of components scripts/styles file-tree



## [3.3.6] - 2019-05-15
### Fixed
- Support Node.js 12 *(outdated gulp.js 3.9.1 dependency fixed via npm-shrinkwrap)*



## [3.3.5] - 2017-10-04
### Fixed
- Babel pattern that doesn't block any files

### Removed
- `$Global`, use via Promise



## [3.3.4] - 2017-09-12
### Fixed
- ESLint warnings



## [3.3.3] - 2017-09-01
### Fixed
- Windows support



## [3.3.2] - 2017-08-29
### Fixed
- Misc corrections



## [3.3.1] - 2017-08-29
### Fixed
- Misc corrections



## [3.3.0] - 2017-08-29
### Changed
- Grand reunification of a nwayo projects



## [3.2.0] - 2017-08-14
### Changed
- Conversion to `@absolunet/nwayo-workflow`



## [3.1.7] - 2017-08-02
### Changed
- SCSS rework



## [3.1.6] - 2017-07-21
### Fixed
- @import supports CSS



## [3.1.5] - 2017-07-19
### Removed
- Compass



## [3.1.4] - 2017-06-05
### Fixed
- Corrections for npm 5



## [3.1.3] - 2017-04-04
### Added
- `babel-preset-env`
- Options for browsers in bundles



## [3.1.2] - 2017-03-28
### Changed
- Name using npm organizations `@absolunet`



## [3.1.1] - 2017-02-24
### Added
- Tests via TravisCI
- Transparent icons
- Sourcemaps option for styles

### Changed
- Docs structure
- Maintenance updates



## [3.1.0] - 2017-02-06
### Added
- Examples

### Changed
- Restructuration of config.scss oriented multi-build / multi-site
- Thinner Autoprefixer
- Fonts support only woff / woff2
- Babel on latest ES2017



## [3.0.4] - 2016-11-02
### Changed
- Update to jQuery 3



## [3.0.3] - 2016-09-30
### Changed
- Better division in `common`
- Foundation cleanup
- Update to ESLint 3.6.1
- Maintenance updates



## [3.0.2] - 2016-09-16
### Added
- SCSS function: `assets-path`

### Changed
- Update to ESLint 3.5.0
- Maintenance updates



## [3.0.1] - 2016-09-02
### Added
- New outline per module with DOM_PARSE/DOCUMENT_LOAD

### Changed
- Maintenance updates



## [3.0.0] - 2016-08-29
### Added
- Multi-build feature with bundles
- Babel
- Custom build for Lodash and Modernizr
- Added `delayedStart` concept


### Changed
- Restructured arborescence
- `konstan` in a separate file
- Converted to ES2015
- Optimization of `watch` task
- JavaScript linter is now ESLint
- Added some good practices from projects
- Maintenance updates



## [3.0.0-alpha.5] - 2015-09-12
### Added
- `rebuild` task
- `konstan` system
- `__` shortcuts
- `PubSub` by default
- Documentation

### Changed
- Renamed `analyze` task to `doctor`
- Inline SVG not in Base64 anymore
- Added some good practices from projects
- Maintenance updates



## [3.0.0-alpha.4] - 2015-02-27
### Added
- Support CLI on Windows

### Changed
- Restructured arborescence
- Added some good practices from projects
- Maintenance updates



## [3.0.0-alpha.3] - 2014-12-10
### Added
- Exclude linting on files prefixed with `vendor-`

### Changed
- Added some good practices from projects



## [3.0.0-alpha.2] - 2014-12-01
### Changed
- Rewritten with gulp.js and SCSS



## [2.1.2] - 2014-10-01
### Changed
- Locked akfe at version 2.1.1



## [2.1.1] - 2014-09-14
### Added
- CLI

### Changed
- Maintenance updates



## [2.1.0] - 2014-08-29
### Changed
- Maintenance updates
- Files nomenclature

### Fixed
- Foundation + Drupal



## [2.0.0] - 2014-04-30
### Changed
- Now structured



## [1.0.0] - 2013-02-08
### Added
- Initial






[Unreleased]:    https://github.com/absolunet/nwayo/compare/3.9.1...HEAD
[3.9.1]:         https://github.com/absolunet/nwayo/compare/3.9.0...3.9.1
[3.9.0]:         https://github.com/absolunet/nwayo/compare/3.9.0-beta.2...3.9.0
[3.9.0-beta.2]:  https://github.com/absolunet/nwayo/compare/3.9.0-beta.1...3.9.0-beta.2
[3.9.0-beta.1]:  https://github.com/absolunet/nwayo/compare/3.8.2...3.9.0-beta.1
[3.8.2]:         https://github.com/absolunet/nwayo/compare/3.8.1...3.8.2
[3.8.1]:         https://github.com/absolunet/nwayo/compare/3.8.0...3.8.1
[3.8.0]:         https://github.com/absolunet/nwayo/compare/3.7.2...3.8.0
[3.7.2]:         https://github.com/absolunet/nwayo/compare/3.7.1...3.7.2
[3.7.1]:         https://github.com/absolunet/nwayo/compare/3.7.0...3.7.1
[3.7.0]:         https://github.com/absolunet/nwayo/compare/3.7.0-rc.1...3.7.0
[3.7.0-rc.1]:    https://github.com/absolunet/nwayo/compare/3.7.0-beta.2...3.7.0-rc.1
[3.7.0-beta.2]:  https://github.com/absolunet/nwayo/compare/3.7.0-beta.1...3.7.0-beta.2
[3.7.0-beta.1]:  https://github.com/absolunet/nwayo/compare/3.6.7...3.7.0-beta.1
[3.6.7]:         https://github.com/absolunet/nwayo/compare/3.6.6...3.6.7
[3.6.6]:         https://github.com/absolunet/nwayo/compare/3.6.5...3.6.6
[3.6.5]:         https://github.com/absolunet/nwayo/compare/3.6.4...3.6.5
[3.6.4]:         https://github.com/absolunet/nwayo/compare/3.6.3...3.6.4
[3.6.3]:         https://github.com/absolunet/nwayo/compare/3.6.2...3.6.3
[3.6.2]:         https://github.com/absolunet/nwayo/compare/3.6.1...3.6.2
[3.6.1]:         https://github.com/absolunet/nwayo/compare/3.6.0...3.6.1
[3.6.0]:         https://github.com/absolunet/nwayo/compare/3.6.0-rc.4...3.6.0
[3.6.0-rc.4]:    https://github.com/absolunet/nwayo/compare/3.6.0-rc.3...3.6.0-rc.4
[3.6.0-rc.3]:    https://github.com/absolunet/nwayo/compare/3.6.0-rc.1...3.6.0-rc.3
[3.6.0-rc.1]:    https://github.com/absolunet/nwayo/compare/3.6.0-beta.6...3.6.0-rc.1
[3.6.0-beta.6]:  https://github.com/absolunet/nwayo/compare/3.6.0-beta.5...3.6.0-beta.6
[3.6.0-beta.5]:  https://github.com/absolunet/nwayo/compare/3.6.0-beta.3...3.6.0-beta.5
[3.6.0-beta.3]:  https://github.com/absolunet/nwayo/compare/3.6.0-beta.2...3.6.0-beta.3
[3.6.0-beta.2]:  https://github.com/absolunet/nwayo/compare/3.5.2...3.6.0-beta.2
[3.5.2]:         https://github.com/absolunet/nwayo/compare/3.5.1...3.5.2
[3.5.1]:         https://github.com/absolunet/nwayo/compare/3.5.0-rc.5...3.5.1
[3.5.0-rc.5]:    https://github.com/absolunet/nwayo/compare/3.5.0-rc.3...3.5.0-rc.5
[3.5.0-rc.3]:    https://github.com/absolunet/nwayo/compare/3.5.0-rc.2...3.5.0-rc.3
[3.5.0-rc.2]:    https://github.com/absolunet/nwayo/compare/3.5.0-rc.1...3.5.0-rc.2
[3.5.0-rc.1]:    https://github.com/absolunet/nwayo/compare/3.5.0-beta.6...3.5.0-rc.1
[3.5.0-beta.6]:  https://github.com/absolunet/nwayo/compare/3.5.0-beta.5...3.5.0-beta.6
[3.5.0-beta.5]:  https://github.com/absolunet/nwayo/compare/3.5.0-beta.4...3.5.0-beta.5
[3.5.0-beta.4]:  https://github.com/absolunet/nwayo/compare/3.5.0-beta.3...3.5.0-beta.4
[3.5.0-beta.3]:  https://github.com/absolunet/nwayo/compare/3.5.0-beta.2...3.5.0-beta.3
[3.5.0-beta.2]:  https://github.com/absolunet/nwayo/compare/3.5.0-beta.1...3.5.0-beta.2
[3.5.0-beta.1]:  https://github.com/absolunet/nwayo/compare/3.4.3...3.5.0-beta.1
[3.4.3]:         https://github.com/absolunet/nwayo/compare/3.4.2...3.4.3
[3.4.2]:         https://github.com/absolunet/nwayo/compare/3.4.1...3.4.2
[3.4.1]:         https://github.com/absolunet/nwayo/compare/3.4.0...3.4.1
[3.4.0]:         https://github.com/absolunet/nwayo/compare/3.3.6...3.4.0
[3.3.6]:         https://github.com/absolunet/nwayo/compare/3.3.5...3.3.6
[3.3.5]:         https://github.com/absolunet/nwayo/compare/3.3.4...3.3.5
[3.3.4]:         https://github.com/absolunet/nwayo/compare/3.3.3...3.3.4
[3.3.3]:         https://github.com/absolunet/nwayo/compare/3.3.2...3.3.3
[3.3.2]:         https://github.com/absolunet/nwayo/compare/3.3.1...3.3.2
[3.3.1]:         https://github.com/absolunet/nwayo/compare/3.3.0...3.3.1
[3.3.0]:         https://github.com/absolunet/nwayo/compare/3.2.0...3.3.0
[3.2.0]:         https://github.com/absolunet/nwayo/compare/3.1.7...3.2.0
[3.1.7]:         https://github.com/absolunet/nwayo/compare/3.1.6...3.1.7
[3.1.6]:         https://github.com/absolunet/nwayo/compare/3.1.5...3.1.6
[3.1.5]:         https://github.com/absolunet/nwayo/compare/3.1.4...3.1.5
[3.1.4]:         https://github.com/absolunet/nwayo/compare/3.1.3...3.1.4
[3.1.3]:         https://github.com/absolunet/nwayo/compare/3.1.2...3.1.3
[3.1.2]:         https://github.com/absolunet/nwayo/compare/3.1.1...3.1.2
[3.1.1]:         https://github.com/absolunet/nwayo/compare/3.1.0...3.1.1
[3.1.0]:         https://github.com/absolunet/nwayo/compare/3.0.4...3.1.0
[3.0.4]:         https://github.com/absolunet/nwayo/compare/3.0.3...3.0.4
[3.0.3]:         https://github.com/absolunet/nwayo/compare/3.0.2...3.0.3
[3.0.2]:         https://github.com/absolunet/nwayo/compare/3.0.1...3.0.2
[3.0.1]:         https://github.com/absolunet/nwayo/compare/3.0.0...3.0.1
[3.0.0]:         https://github.com/absolunet/nwayo/compare/3.0.0-alpha.5...3.0.0
[3.0.0-alpha.5]: https://github.com/absolunet/nwayo/compare/3.0.0-alpha.4...3.0.0-alpha.5
[3.0.0-alpha.4]: https://github.com/absolunet/nwayo/compare/3.0.0-alpha.3...3.0.0-alpha.4
[3.0.0-alpha.3]: https://github.com/absolunet/nwayo/compare/3.0.0-alpha.2...3.0.0-alpha.3
[3.0.0-alpha.2]: https://github.com/absolunet/nwayo/compare/2.1.2...3.0.0-alpha.2
[2.1.2]:         https://github.com/absolunet/nwayo/compare/2.1.1...2.1.2
[2.1.1]:         https://github.com/absolunet/nwayo/compare/2.1.0...2.1.1
[2.1.0]:         https://github.com/absolunet/nwayo/compare/2.0.0...2.1.0
[2.0.0]:         https://github.com/absolunet/nwayo/compare/1.0.1...2.0.0
[1.0.0]:         https://github.com/absolunet/nwayo/releases/tag/1.0.0
