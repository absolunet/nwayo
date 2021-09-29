# Bundles

> A bundle is the result of is one or many collections put together to form a specific groupment of ressources (assets, images, scripts and styles) with a common purpose.

## Path
The bundles files are located under `[NWAYO_ROOT]/bundles/[NAME]`


## Content
### Output paths
- Builds
- JSON konstan
- Root URL

### Assets
- Component

### Scripts
- Collections
- Babel
- Minification

### Styles
- Collections
- Autoprefixer
- Source maps
- Minification



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

#-- Styles
styles:
  options:
    minify: true
    sourcemaps: false
    autoprefixer:
      - '> .25%'
      - 'not dead'
```

#### `nwayo/bundles/[BUNDLE_NAME]/_[BUNDLE_COMPONENT_NAME_1].yaml`
```yaml
#-------------------------------------
#-- [BUNDLE_NAME] - [BUNDLE_COMPONENT_NAME_1]
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