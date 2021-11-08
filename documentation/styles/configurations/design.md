# [Design](https://sass-lang.com/documentation/variables)

## Content
In this configuration file, we set up variable that can be reused in this component. Every property that is reused or
relate to each other could be set in a variable.

- Colors
- Transitions
- Size
- Font and text related attributes
- Border
- Media queries
- ...

## Good practices
- Order variables by type and or purpose
- It's a good idea to have a general component where you declare the general estethic of you site and map those variables into the component
- Try to give significant name that describes what they are used for to the variables and not only one that describes what they are.


## Exemple
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

##Toolbox(../../../packages/toolbox/styles/_variables.scss)
- **$nwayo-svg-replacement-1-color :** #ba0bab;
- **$nwayo-svg-replacement-2-color :** #c0ffee;
- **$nwayo-svg-replacement-colors :**  ($nwayo-svg-replacement-1-color, $nwayo-svg-replacement-2-color);
- **$nwayo-social-colors :** Social network colors
- **$nwayo-sansserif-font :**  Helvetica, Arial, Verdana, sans-serif;                                         // stylelint-disable-line value-keyword-case
- $**nwayo-serif-font :**      'Times New Roman', Times, serif;                                               // stylelint-disable-line value-keyword-case 
- **$nwayo-monospace-font** :  Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', Courier, monospace; // stylelint-disable-line value-keyword-case



