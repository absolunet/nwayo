> [Work in progress]

# Stylelint
> [For more details as how to use Stylelint, please consult its official documentation](https://stylelint.io/).


## Include Stylelint to your project

## Personalise Stylelint config
You can add rule settings in the `.stylelintc.yaml` file at the root of your Nwayo directory

```yaml
extends: '@absolunet/stylelint-config-nwayo'

rules:
  scss/selector-no-union-class-name: null
  scss/at-import-partial-extension: null
  scss/map-keys-quotes: null
  scss/at-rule-conditional-no-parentheses: null

```


[Consult the default Stylelint configurations](https://documentation.absolunet.com/stylelint-config/scss/api/)

### Add file or directory to ignore
You can add the path to the specific file or directory in the `.stylelintignore` file at the root of your Nwayo directory

Ex:
```
components/*/styles/vendor
node_modules
```
### Enable or disable a rule for a section
**DO NOT FORGET TO RE-ENABLE THE RULE**
```scss
// stylelint-disable rule-to-disable
...
// stylelint-enable rule-to-disable
```

### Enable or disable a rule for a line
```scss
@media print {
	@page {
		margin: 1cm; // stylelint-disable-line unit-whitelist
	}
...
```
