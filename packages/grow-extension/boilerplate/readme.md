# @absolunet/nwayo-extension-MYEXTENSION

[![npm](https://img.shields.io/npm/v/@absolunet/nwayo-extension-MYEXTENSION.svg)](https://www.npmjs.com/package/@absolunet/nwayo-extension-MYEXTENSION)
[![npm dependencies](https://david-dm.org/absolunet/nwayo-extension-MYEXTENSION/status.svg)](https://david-dm.org/absolunet/nwayo-extension-MYEXTENSION)
[![npms](https://badges.npms.io/%40absolunet%2Fnwayo-extension-MYEXTENSION.svg)](https://npms.io/search?q=%40absolunet%2Fnwayo-extension-MYEXTENSION)
[![Travis CI](https://api.travis-ci.org/absolunet/nwayo-extension-MYEXTENSION.svg?branch=master)](https://travis-ci.org/absolunet/nwayo-extension-MYEXTENSION/builds)
[![Code style ESLint](https://img.shields.io/badge/code_style-@absolunet/node-659d32.svg)](https://github.com/absolunet/eslint-config-node)

> My extension for [nwayo](https://absolunet.github.io/nwayo)

## Install

```sh
$ npm install @absolunet/nwayo-extension-MYEXTENSION
```


## Build

```sh
$ nwayo run my-extension:my-task
```


## Usage

### nwayo.yaml
```yaml
extensions:
  '@absolunet/MYEXTENSION':
    enabled: true
    options:
    	foo: bar
    	bar: foo
```

### file.yaml
- Under `[...]/nwayo/[COMPONENT]/extensions/my-extension/`
- [...]

```yaml
foo: bar
```


## Foo

### Bar
Lorem ipsum


## License

MIT © [Absolunet](https://absolunet.com)
