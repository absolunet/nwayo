# Fonts

#### ⚠️ Work in progress ⚠️
####

The fonts are located under the `fonts` folder, under the component associated with the font in question.

[When declaring fonts, use the nwayo variables for the font-weight.](../../packages/toolbox/styles/_variables.scss).

You need to have a WOFF 1.0 font (`.woff`) under the `fonts` folder. Optionnally you can add a WOFF 2.0 font (`.woff2`) with the same filename if it is available.


## Mixin
The `@font-face` mixins is used to generate the css

[Consult the list of all mixins for more details](configurations/mixins.md)

```scss
//-- Font-face
@mixin load-font-mixin ($name, $filename, $context, $weight:normal, $style:normal) {
	$url:   assets-path($filename, $context, 'fonts');
	$woff2: if(fileexists('components/' + $context + '/assets/fonts/' + $filename + '.woff2'), url($url + '.woff2') format('woff2') + ',', '');
	@font-face {
		font-family: $name;
		font-weight: $weight;
		font-style: $style;
		src: #{$woff2} url($url + '.woff');
	}
}
```
- `$name` = The name of the font used for the `font-family` in the css.
- `$filename` = File name of the font.
- `$context` = In what context the font is used. (component)
- `$weight` = The weight of the font. `normal` is the default value.
- `$style` = The style of the font. `normal` is the default value.

### How to use
To generate valid css, `$name`, `$filename` and `$context` are required.
```scss
//-- Generate font-family
@include load-font-mixin('roboto', 'roboto-light-webfont', 'common', $weight:$light-weight);

//-- Variable usage
$common-text-font: 'Open Sans', sans-serif;
```

## Font-weight management
It is preferable to have a font for each of the weights used in the component and to use the same `$ name` for each of them. This makes it easier to manage fat overall.

```scss
//-- Generate font-weight
@include load-font-mixin('roboto', 'roboto-light-webfont', 'common', $nwayo-light-weight);
@include load-font-mixin('roboto', 'roboto-regular-webfont', 'common', $nwayo-normal-weight);
@include load-font-mixin('roboto', 'roboto-bold-webfont', 'common', $nwayo-bold-weight);
@include load-font-mixin('roboto', 'roboto-black-webfont', 'common', $nwayo-black-weight);

//-- SCSS usages
$common-text-font: 'roboto', sans-serif;

body {
	font-family: $text-font;
	font-weight: $light-weight;
}

h1 {
	font-weight: $black-weight;
}
```
