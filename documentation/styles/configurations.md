# Configurations

> It is possible to set including design variables, mixins and function inside a component. 
> Those configurations can be imported to an other component and or bundle to make sure that the styling and 
> features are apply with consistency


## Structures

The source files are located under `[NWAYO_ROOT]/components/[COMPONENT_NAME]/styles`. The component must also be included in one or many bundle.
- config /
  - _design.scss
  - _functions.scss
  - _mixins.scss
- config.scss

### `config.scss`
The config.scss located at the root of the style directory purpose is to importe the available configs
```scss
//-------------------------------------
//-- [COMPONENT_NAME] - Configuration
//-------------------------------------

@import 'components/[COMPONENT_NAME]/styles/config/functions';
@import 'components/[COMPONENT_NAME]/styles/config/design';
@import 'components/[COMPONENT_NAME]/styles/config/mixins';

```
This config file is imported before the styling component in the bundle file
```yaml

```

## Design

## Mixins

## Functions


