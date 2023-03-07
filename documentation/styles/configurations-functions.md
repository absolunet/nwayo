# Configurations - Functions

#### ⚠️ Work in progress ⚠️
####

## Content
[SCSS Functions](https://sass-lang.com/documentation/at-rules/function)
The difference between functions and mixins is that the mixins generate an output (mostly styling directives) and
functions generates values

## Exemple
```scss
//-------------------------------------
//-- [COMPONENT_NAME] - Config - Functions
//-------------------------------------

@function bp($arguments) {
	@return 'screen and ' + breakpoint($arguments);
}


```

##Toolbox
To see a complet list of functions that are available in Nwayo you can consult:
- [functions-core](../../../packages/toolbox/styles/_functions-core.scss)
  - **konstan-get :** Konstan shortcut: Get value
  - **nwayo-assets-path** : Generate an asset path based on file type
  - **nwayo-build-path** : Generate an asset path  based on file type from build root
  - **nwayo-zindex :** Return a z-index value including a delta that for a scope includes in given scopes
  - **nwayo-breakpoint-media :** Simulate a breakpoint
- [functions-helpers](../../../packages/toolbox/styles/_functions-helpers.scss)
  - **nwayo-map-deep-split-path :** Deep map: Path splitter
  - **nwayo-map-deep-has-key :** Deep map: Has key
  - **nwayo-map-deep-get :** Deep map: Get value
  - **nwayo-str-replace :** String replace
  - **nwayo-to-string :** Cast to string
  - **nwayo-list-contains :** Check if list contains value
  - **nwayo-serialize :** Serialize value to a string
- [functions-remcalc](../../../packages/toolbox/styles/_functions-remcalc.scss)
  - [Shameless copy of Foundation's rem-calc()](https://github.com/zurb/foundation-sites/blob/v6.5.3/scss/util/_unit.scss)
