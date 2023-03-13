# nwayo-extension-MYEXTENSION

> My extension for [nwayo](https://valtech-commerce.github.io/nwayo)

## Install

```sh
$ npm install nwayo-extension-MYEXTENSION
```


## Build

```sh
$ nwayo run my-extension:my-task
```


## Usage

### nwayo.yaml
```yaml
extensions:
  'MYEXTENSION':
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

[MIT](LICENSE) © [Valtech Canada inc.](https://www.valtech.ca/)
