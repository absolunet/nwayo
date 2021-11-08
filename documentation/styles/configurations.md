# Configurations

> It is possible to set including design variables, mixins and function inside a component. 
> Those configurations can be imported to an other component and or bundle to make sure that the styling and 
> features are apply with consistency.
> 
It's a good idea to have a general component where you declare the general look and feel of your project and remap those 
variable into more specifics components


## Structures

The source files are located under `[NWAYO_ROOT]/components/[COMPONENT_NAME]/styles`. The component must also be included in one or many bundle.
- config /
  - _design.scss
  - _functions.scss
  - _mixins.scss
- config.scss

To be able to use configurations, we must importe the config file before the styling component in the bundle file. This will make them available inside the component where those configs are imported
```yaml
... 

#-- Styles
styles:
  collections:
    [COLLECTION_NAME]:
      - components/[GENERAL_COMPONENT_NAME]/styles/config // General project Config
      - components/[COMPONENT_NAME]/styles/config
      - components/[COMPONENT_NAME]/styles/[COMPONENT_NAME]

...
```

### `config.scss`
The config.scss located at the root of the style directory purpose is to importe the available configs
```scss
//-------------------------------------
//-- [COMPONENT_NAME] - Configuration
//-------------------------------------

@import 'components/[COMPONENT_NAME]/styles/config/design';
@import 'components/[COMPONENT_NAME]/styles/config/mixins';
@import 'components/[COMPONENT_NAME]/styles/config/functions';

```

## Design

### Content
In this configuration file, we set up variable that can be reused in this component. Every property that is reused or 
relate to each other could be set in a variable.

- Colors
- Transitions
- Size
- Font and text related attributes
- Border
- Media queries

### Good practices
- Order variables by type and or purpose
- It's a good idea to have a general component where you declare the general estethic of you site and map those variables into the component
- Try to give significant name that describes what they are used for to the variables and not only one that describes what they are.


### Exemple
```scss
//-------------------------------------
//-- [COMPONENT_NAME] - Config - Design
//-------------------------------------

...
$[COMPONENT_NAME]-title-color: #ffffff;
$[COMPONENT_NAME]-text-color: $text-color;
$[COMPONENT_NAME]-alt-text-color: konstan-get('color.black');
...

```

## Mixins
### Content
In this configuration file, we set up variable that can be reused in this component. Every property that is reused or
relate to each other could be set in a variable.

- Colors
- Transitions
- Size
- Font and text related attributes
- Border
- Media queries

### Good practices
- Order variables by type and or purpose
- It's a good idea to have a general component where you declare the general estethic of you site and map those variables into the component
- Try to give significant name that describes what they are used for to the variables and not only one that describes what they are.


### Exemple
```scss
//-------------------------------------
//-- [COMPONENT_NAME] - Config - Mixin
//-------------------------------------

...
@mixin grid-column-styles(
  $columns: $grid-column-count,
  $gutters: $grid-column-gutter
) {
  @include grid-column-size($columns);
  @include grid-column-gutter($gutters: $gutters);
  float: $global-left;
}

...

```

## Functions


