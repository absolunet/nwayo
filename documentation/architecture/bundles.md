> [Work in progress]

# Bundles

> A bundle is the result of is one or many collections put together to form a specific groupment of ressources (assets, images, scripts and styles) with a common purpose.

## Path and settings
The bundles files are located under `[NWAYO_ROOT]/bundles/[NAME]`
There can be many sub-bundle inside of a primary bundle

### Exemple:
`[NWAYO_ROOT]/bundles/[PRIMARY_BUNDLE_NAME]`

`[NWAYO_ROOT]/bundles/[PRIMARY_BUNDLE_NAME]/[PRIMARY_BUNDLE_NAME].yaml`

## Content of the `[NWAYO_ROOT]/bundles/[PRIMARY_BUNDLE_NAME]/[PRIMARY_BUNDLE_NAME].yaml`
This is where we set the global configurations for the compilation of this specific bundle

### Output paths
- Include in the main Bundle file
  - Will be applied to all the collections in this bundle
- Available settings
  - `build` : Build's path relative to Nwayo folder and output url
  - `konstan` : JSON konstan's path relative to Nwayo folder and output url
  - `konstan` : Root URL

#### Exemple
```yaml
#-- Output paths (relative to nwayo folder) and output url
output:
  konstan: [PATH_ROOT]/[BUILD_FOLDER_NAME]/[BUNDLE_NAME]
  build:   [PATH_ROOT]/[BUILD_FOLDER_NAME]/[BUNDLE_NAME]
  url:     /[BUILD_FOLDER_NAME]/[BUNDLE_NAME]
```

### Assets
- Component : Declare in the collection file
- Can list more than one
```yaml
#-- Assets
assets:
  components:
    - [COMPONENT_NAME]
```

### Scripts
- Collections
- Babel
- Minification

```yaml
#-- Scripts
scripts:
  options:
    minify: true
    babel:
      - '> .25%'
      - 'not dead'
      -
  allowBabel:
    - vendor/node_modules/foundation-sites
    - vendor/node_modules/@absolunet

```

### Styles
- Collections
- Autoprefixer
- Source maps
- Minification

```yaml
#-- Styles
styles:
  options:
    minify: true
    sourcemaps: false
    autoprefixer:
      - '> .25%'
      - 'not dead'

```


## Good practices
- Minify Bundle before using in prod
- One bundle by section or major functionality

## Tasks
Almost all the tasks will interact with a component

## Exemple
### Structure
```
/ nwayo
    / bundles
        / [BUNDLE_NAME] /
            _[BUNDLE_COMPONENT_NAME_1].yaml
            _[BUNDLE_COMPONENT_NAME_2].yaml
            _...
            [BUNDLE_NAME].yaml

        / ..
    / components
        / ...
```

#### `nwayo/bundles/[BUNDLE_NAME]/[BUNDLE_NAME].yaml`
```yaml
#-------------------------------------
#-- [BUNDLE_NAME]
#-------------------------------------

#-- Output
#-- Output paths (relative to nwayo folder) and output url
output:
  konstan: [PATH_ROOT]/[BUILD_FOLDER_NAME]/[BUNDLE_NAME]
  build:   [PATH_ROOT]/[BUILD_FOLDER_NAME]/[BUNDLE_NAME]
  url:     /[BUILD_FOLDER_NAME]/[BUNDLE_NAME]

#-- Scripts
scripts:
  options:
    minify: true
    babel:
      - '> .25%'
      - 'not dead'
      -
  allowBabel:
    - vendor/node_modules/foundation-sites
    - vendor/node_modules/@absolunet

#-- Styles
styles:
  options:
    minify: true
    sourcemaps: false
    autoprefixer:
      - '> .25%'
      - 'not dead'

```


## Content of the `[NWAYO_ROOT]/bundles/[PRIMARY_BUNDLE_NAME]/_[SUB_BUNDLE_NAME].yaml`
This is where we set the content of this sub-bundle that will be build

### Scripts
- Component : ...
```yaml
#-- Assets
assets:
  components:
    - [COMPONENT_NAME]
```

### Style
- Component : ...
```yaml
#-- Assets
assets:
  components:
    - [COMPONENT_NAME]
```

### Assets
- Component : Declare in the collection file
- Can list more than one
```yaml
#-- Assets
assets:
  components:
    - [COMPONENT_NAME]
```
###`[NWAYO_ROOT]/bundles/[PRIMARY_BUNDLE_NAME]/_[SUB_BUNDLE_NAME].yaml`
```yaml
#-------------------------------------
#-- [BUNDLE_NAME] - [SUB_BUNDLE_NAME]
#-------------------------------------

#-- Scripts
scripts:
  collections:
    [COLLECTION_NAME]:
      - vendor/node_modules/@absolunet/nwayo-toolbox/scripts/collection-starter
      - components/[COMPONENT_NAME]/scripts/[COMPONENT_NAME]

#-- Styles
styles:
  collections:
    [COLLECTION_NAME]:
      - components/[GENERAL_COMPONENT_NAME]/styles/config // General project Config
      - components/[COMPONENT_NAME]/styles/config
      - components/[COMPONENT_NAME]/styles/[COMPONENT_NAME]

#-- Assets
assets:
  components:
    - [COMPONENT_NAME]

```

