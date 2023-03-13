# Extensions
> Extensions are new tasks that you can add to your nwayo workflow

## How to install
Add the extension to your `package.json`
```json
{
  "name": "my-beautiful-project",
  "license": "UNLICENSED",
  "private": true,
  "dependencies": {
    "@absolunet/nwayo-workflow": "3.6.0",
    "@absolunet/nwayo-extension-officially-perfect": "1.0.0",
    "nwayo-extension-customy-correct": "1.0.0"
  }
}
```

## How to enable and configure
Add the extension to your `nwayo.yaml`
```yaml
extensions:
  '@absolunet/officially-perfect':
    enabled: true
    options:
      param1: foo
      param2: bar

  'customy-correct':
    enabled: true
    options:
      foo: param1
      bar: param2
```

For the detailled options and other configurations check the extension's documentation.


## How to run tasks
Each extension should give you the list of tasks you can run but they should follow this format
```bash
nwayo run officiallyperfect:task1
nwayo run officiallyperfect:task2

nwayo run customycorrect:build-this
nwayo run customycorrect:build-that
```


## Official extensions
These are the official extensions
- [Styleguide](https://github.com/valtech-commerce/nwayo-extension-styleguide) - Generate a styleguide from templates in your different components


## Find extensions
These are the extensions [tagged on npm](https://www.npmjs.com/search?q=keywords:nwayo-extension)
