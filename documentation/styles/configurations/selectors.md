# [Selectors](https://sass-lang.com/documentation/style-rules/parent-selector)

## Content
You can store selector in a variable, so it can be reused multiple times. It is recommended to use the sass parent selector when needed.  


## Good practices
- Use general selector linter rules
- Use scss [nesting concept](#exemple-1) OR [concatenate selector](#exemple-2) to create new ones
- Useful for selectors that are frequently used
- 


## Exemple 1
```scss
//-------------------------------------
//-- [COMPONENT_NAME] - Config - Selectors
//-------------------------------------

...
//-- Base
$[COMPONENT_NAME]-pageheader-selector: '.page-header';

//-- Fixed nav
$[COMPONENT_NAME]-fixednav-selector:          '.panel.wrapper';

//-- Main Nav - Full
$[COMPONENT_NAME]-mainnav-selector:          '.header.wrapper'; // Wrapper
$[COMPONENT_NAME]-mainnav-logo-selector:     ' .logo';          // Logo
$[COMPONENT_NAME]-mainnav-wrapper-selector:  '.nav-sections';   // Navigation (main menu)
$[COMPONENT_NAME]-mainnav-search-selector:   '.search-wrapper'; // Search
...

```

## Exemple 2
```scss
//-------------------------------------
//-- [COMPONENT_NAME] - Config - Selectors
//-------------------------------------

...
//-- Base
$[COMPONENT_NAME]-pageheader-selector:          '.page-header';

//-- Fixed nav
$[COMPONENT_NAME]-fixednav-selector:            $[COMPONENT_NAME]-pageheader-selector + ' .panel.wrapper';

//-- Main Nav - Full
$[COMPONENT_NAME]-mainnav-selector:             $[COMPONENT_NAME]-pageheader-selector + ' .header.wrapper'; // Wrapper
$[COMPONENT_NAME]-mainnav-logo-selector:        $[COMPONENT_NAME]-pageheader-selector + ' .logo';           // Logo
$[COMPONENT_NAME]-mainnav-wrapper-selector:     $[COMPONENT_NAME]-pageheader-selector + ' .nav-sections';   // Navigation (main menu)
$[COMPONENT_NAME]-mainnav-search-selector:      $[COMPONENT_NAME]-mainnav-selector + ' .search-wrapper';    // Search
...

```