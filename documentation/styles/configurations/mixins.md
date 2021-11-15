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


##Toolbox
To see a complet list of functions that are available in Nwayo you can consult:
- [mixins-core](../../../packages/toolbox/styles/_mixins-core.scss)
  - **nwayo-bg-image-styles :** Generate Background image Styles (Inline or not)
  - **nwayo-scalable-icon-styles :** Generate Scalable icon Styles (Inline)
  - **nwayo-scalable-icon-colored-states-styles :** Generate Scalable icon multicolored states with state (Inline)
  - **nwayo-load-font-styles :** Generate Font-face Styles
- [mixins-helpers](../../../packages/toolbox/styles/_mixins-helpers.scss)
  - **nwayo-pseudo-image-styles :** Style of the image in ::before/::after pseudo-elements Styles
  - **nwayo-textreplace-image-styles :** Style of the image which replaces text
  - **nwayo-clearfix-styles :** Clearfix
  - **nwayo-visually-hidden-styles :** Visually Hidden
  - **nwayo-scaling-block-styles :** Create a block that scale within a ratio styles
  - **nwayo-valign-parent-styles :** Vertical center the child within the parent styles
  - **nwayo-list-reset-styles :** Reset List Styles
  - **nwayo-list-inline-styles :** Reset List Inline Styles
  - **nwayo-placeholder-styles :** Placeholder Styles
  - **nwayo-select-reset-styles :** Reset Select Styles
  - **nwayo-input-file-button-styles :** Input type file button Styles
  - **nwayo-arrow-styles :** Arrow Styles
  - **nwayo-column-list-styles :** Create a list with columns Styles


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


