# [Mixins](https://sass-lang.com/documentation/at-rules/mixin)

#### ⚠️ Work in progress ⚠️
####

## Content
Mixins purpose is to encapsulate styles to which it can be included and reused at multiple places. They can be modified with variable and conditions inside.

## Good practices
- Order mixins by type and or purpose
- It's a good idea to have a general component where you declare your general site aesthetic and map those variables into the component
- Try to give significant name that describes what they are used for to the variables and not only one that describes what they are.
- Mixins must end with the type of content they output
- Use mixins to avoid duplicate code
- You can include mixins in another mixins
- If you need to adjust something that should be in the mixins but that modification only apply to an edge case, add a parameter to the mixin so the right output is generated.


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


