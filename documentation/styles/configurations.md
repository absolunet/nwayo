# Configurations

#### ⚠️ Work in progress ⚠️
####

> It is possible to set including design variables, mixins and function inside a component.
> Those configurations can be imported to another component and or bundle to make sure that the styling and
> features are applied with consistency.

It's a good idea to have a general component where you declare the general look and feel of your project and remap those
variable into more specifics components

## Types
They are 4 types of assets:
- [Design](configurations-design.md)
- [Functions](configurations-functions.md)
- [Mixins](configurations-mixins.md)
- [Selectors](configurations-selectors.md)


## Structures
The source files are located under `[NWAYO_ROOT]/components/[COMPONENT_NAME]/styles`. The component must also be included in one or many bundle. The diffenr
```
- config /
  - _design.scss
  - _functions.scss
  - _mixins.scss
  - ...
- config.scss
```

To be able to use configurations, we must importe the config file before the styling component in the bundle file. This will make them available inside the component where those configs are imported
```yaml
//-------------------------------------
//-- [COMPONENT_NAME - Configuration
//-------------------------------------

@import 'components/[COMPONENT_NAME]/styles/config/design';
@import 'components/[COMPONENT_NAME]/styles/config/mixins';
@import 'components/[COMPONENT_NAME]/styles/config/functions';
@import 'components/[COMPONENT_NAME]/styles/config/selectors';

```
