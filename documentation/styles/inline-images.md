# Inline image

#### ⚠️ Work in progress ⚠️
####

The main difference between `images inline` and `images` is that `image inline` will embed the content of the image directly into the stylesheet, eliminating another HTTP request.
The images are located under the `inline-images` folder, under the component associated with the image in question.

## Mixin
The mixin used to generate the images at the css level. It will then be possible to include them by `@include` under the desired selector.

```scss
//-- Background image
@mixin bg-image-mixin ($file, $context, $inline:false, $width:false, $height:false, $color:false) {

	// uri
	$uri: '';
	@if $inline {
		$inline-image-path: assets-path($file, $context, 'inline');

		@if str-index($file, '.svg') {
			$svg: readfile($inline-image-path);

			@if $color {

				// single color
				@if type-of($color) == 'color' {
					$svg: color-replace($svg, $svg-replacement-1, $color);

				// list
				} @else if type-of($color) == 'list' {
					@for $i from 1 through length($color) {
						$svg: color-replace($svg, nth($svg-replacement, $i), nth($color, $i));
					}

				// hash
				} @else {
					@each $source, $target in $color {
						$svg: color-replace($svg, $source, $target);
					}
				}
			}

			$uri: svg-data-uri($svg);

		} @else {
			$uri: inline-image($inline-image-path);
		}
	} @else {
		$uri: url(assets-path($file, $context, 'images'));
	}

	// high density
	@if str-index($file, '@2x') {
		$path: 'components/' + $context + '/assets/' + if($inline, 'inline-', '') + 'images/' + $file;
		$width:  if($width, $width, image-width($path));
		$height: if($height, $height, image-height($path));

		@media print, (-webkit-min-device-pixel-ratio: 1.25), (min-resolution: 1.25dppx), (min-resolution: 120dpi) {
			background-image: $uri;
			background-size: $width / 2 $height / 2;
		}

		$uri: str-replace($uri, '@2x', '');
	}

	background-image: #{$uri};
}
```
- `$file` = Name of the file
- `$context` = The usage context of this image
- `$inline` = If the image is inline or not
- `$width` = Assign the width of the image @2x.
- `$height` =Assign the height of the image @2x.
- `$color` = the color used in the image for the SVG format

It is also possible to use `scalable-icon-mixin` for icons and thus have basic styles for the various important background properties.

```scss
//-- Scalable icon
@mixin scalable-icon-mixin ($file, $context, $color:false) {
	@include bg-image-mixin($file, $context, $inline:true, $color:$color);
	background-position: center center;
	background-repeat: no-repeat;
	background-size: contain;
}
```

## How to use
To be able to generate an image, the `$file` and `$context` are required.
The `$inline` is required when used with `bg-image-mixin`.
For the `scalable-icon-mixin`, the `$inline` variable default value is `true`.

```scss
// Inline
@mixin misc3-image { @include bg-image-mixin('misc3.png', 'common', $inline:true); }
@mixin icon3-image { @include bg-image-mixin('icon3.png', 'foobar', $inline:true); }

// Scalable
@mixin icon4-image { @include scalable-icon-mixin('icon4.svg', 'foobar'); }

//-- Usage in scss
.logo {
	@include logo1-image;
}
```

### Colors usage
To generate an svg of one or more colors, the svg must absolutely match one of these options.
1. **Simple color**: the color passed in parameter will replace the `# BA0BAB` color of the svg.
2. **Colors list**: two colors must be passed as a parameter in this format `($ firstColor, $ secondColor)`. These colors will replace the colors of the svg in the order `# BA0BAB`,` # C0FFEE`.
3. **Hash**: Using a map where the value will replace the key. `(key1: value1, key2: value2, key3: value3)`

```scss
// Scalable with color
$firstColor  = #25329d;
$secondColor = #636363;
$firstKey    = #ff0000;
$secondKey   = #00ff00;
$map: ($firstKey: $firstColor, $secondKey: $secondColor);

//-- Single color
@mixin icon-single-color { @include scalable-icon-mixin('icon-single.svg', 'foobar', $color:$firstColor); }

//-- List
@mixin icon-list-color { @include scalable-icon-mixin('icon-list.svg', 'foobar', $color:($firstColor, $secondColor)); }

//-- Hash
@mixin icon-hash-color { @include scalable-icon-mixin('icon-map.svg', 'foobar', $color:$map); }

```
