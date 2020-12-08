# Nwayo 4 prototype

## Getting started

Install dependencies.

```bash
npm install
```


## Compile assets

To compile all the available bundles, execute the following command:

```bash
npm run build:all
```

To compile in watch mode, execute the following command:

```bash
npm run build:watch
```

To compile all the available bundles in production mode (minified, with NODE_ENV=production), execute the following command:

```bash
npm run build:all:production
```

To test the code quality (ESLint and Stylelint) , execute the following command:

```bash
npm run test:standards
```

To run the unit test suites through Jest, execute theo following command:

```bash
npm run test:unit
```

To run all tests (standards and unit), simply run the default test command:

```bash
npm test
```

## Dependencies system

In nwayo 4, the dependencies are managed in a specific way:

 - Compiler dependencies: `proto-nwayo/package.json`
 - Components bootstrapper: `proto-nwayo/src/package.json`
   - This file should only contain local or remote nwayo components. It should not include any other dependency.
 - Front-end dependencies: `proto-nwayo/src/components/{component-name}/package.json`
   - Each component should list its own dependencies. If two components are using the same dependency, and they don't resolve the same version, a `node_modules` folder will be created inside each of the component. **This should not happen!** If it happens, the version resolution must be fixed from each `package.json` files (never the `package-lock.json` manually)
