# [Mixins](https://sass-lang.com/documentation/at-rules/mixin)
## Content
In this configuration file, we set up variable that can be reused in this component. Every property that is reused or
relate to each other could be set in a variable.

- Colors
- Transitions
- Size
- Font and text related attributes
- Border
- Media queries

## Good practices
- Order variables by type and or purpose
- It's a good idea to have a general component where you declare the general aesthetic of you site and map those variables into the component
- Try to give significant name that describes what they are used for to the variables and not only one that describes what they are.


## Exemple
```scss
//-------------------------------------
//-- [COMPONENT_NAME] - Config - Mixins
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


