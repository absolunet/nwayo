# [Design](https://sass-lang.com/documentation/variables)

#### ⚠️ Work in progress ⚠️
####

## Content
In this configuration file, we set up a variable that can be reused in this component. Every property that is reused or
relate to each other could be set in a variable.

- Colors
- Transitions
- Size
- Font and text-related attributes
- Border
- Media queries
- ...

## Good practices
- Make sure you use the proper social media color and be aware of how you legally can use it. For reference, [consult the variable files](../../../packages/toolbox/styles/_variables.scss) and make sure they did not change since the last release. [If they did, you can create an issue to have them updated.](https://github.com/absolunet/nwayo/issues)
- Order variables by type and or purpose
- It's a good idea to have a general component where you declare your general site esthetics and map those variables into the component
- Try to give significant name that describes what they are used for to the variables and not only one that describes what they are.
- The variable must end by the type of value they are. [Consult the list of the allowed sass values](https://sass-lang.com/documentation/values).
- Give a general idea of what the variable is without giving any visual clue of what they are.

| Value Description                         	| Bad ✖                                                             	| Good ✔                                                      	|
|-------------------------------------------	|-------------------------------------------------------------------	|-------------------------------------------------------------	|
| The main color of a border used is black  	| `$[COMPONENT_NAME]-border-black-color: konstan-get('color.black'); `	| `$[COMPONENT_NAME]-border-color: konstan-get('color.black');` 	|
| The font weight used for titles           	| `$[COMPONENT_NAME]-bold-weight: 700; `                              	| `$[COMPONENT_NAME]-title-weight: $nwayo-bold-weight;`       	|

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

##Toolbox
To see a complete list of functions that are available in Nwayo you can consult :
- [Variables](../../../packages/toolbox/styles/_variables.scss)
  - **$nwayo-svg-replacement-1-color :** #ba0bab;
  - **$nwayo-svg-replacement-2-color :** #c0ffee;
  - **$nwayo-svg-replacement-colors :**  ($nwayo-svg-replacement-1-color, $nwayo-svg-replacement-2-color);
  - **$nwayo-social-colors :** Social network colors
  - **$nwayo-sansserif-font :**  Helvetica, Arial, Verdana, sans-serif;                                         // stylelint-disable-line value-keyword-case
  - **$nwayo-serif-font :**      'Times New Roman', Times, serif;                                               // stylelint-disable-line value-keyword-case
  - **$nwayo-monospace-font :**  Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', Courier, monospace; // stylelint-disable-line value-keyword-case
  - **$nwayo-thin-weight :**       100;
  - **$nwayo-extralight-weight :** 200;
  - **$nwayo-light-weight :**      300;
  - **$nwayo-normal-weight :**     400;
  - **$nwayo-medium-weight :**     500;
  - **$nwayo-semibold-weight :**   600;
  - **$nwayo-bold-weight :**       700;
  - **$nwayo-extrabold-weight :**  800;
  - **$nwayo-black-weight :**      900;
  - **$nwayo-bull-char :**   '\2022'
  - **$nwayo-times-char :**  '\00D7';
  - **$nwayo-endash-char :** '\2013';
  - **$nwayo-textfields-selector :** 'input[type="text"], input[type="password"], input[type="email"], input[type="tel"], input[type="url"], input[type="search"], input[type="date"], input[type="number"]';
  - **$nwayo-hover-selector :**     'html:not([data-whatintent="touch"]) &:hover';
  - **$nwayo-docloaded-selector :** 'body.document-loaded';
  - **$debug-red :**    #ee2c2c;
  - **$debug-orange :** #ffa500;
  - **$debug-yellow :** #ffdf33;
  - **$debug-green :**  #76ee00;
  - **$debug-blue :**   #1e90ff;
  - **$debug-purple :** #a020f0;
