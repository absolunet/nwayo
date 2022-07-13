# Images

#### ⚠️ Work in progress ⚠️
####

The images are located in the `images` directory, under its component.

## Mixin
The mixin used to generate the images at the css level. It will then be possible to include them by `@include` under the desired selector.
**NB:** Please refer to the [inline-image](inline-image.md) for `inline` or `Scalable` images.

```scss
//-- Background image
@mixin bg-image-mixin ($file, $context, $inline:false, $width:false, $height:false, $color:false) {

	// uri
	$uri: '';
	@if $inline {
		// Portion detailed in the inline-image section
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
- `$color` = the color used in the image for the SVG format. Consult the [inline-image](inline-image.md) for more infos.

## How to use
To be able to generate an image, the `$file` and `$context` are required.
```scss
// Normal
@mixin misc1-image { @include bg-image-mixin('misc1.png', 'common'); }
@mixin logo1-image { @include bg-image-mixin('logo1.png', 'foobar'); }

// High-density
@mixin misc2-image { @include bg-image-mixin('misc@2x.png', 'common'); }

// Inline
@mixin misc3-image { @include bg-image-mixin('misc3.png', 'common', $inline:true); }
@mixin icon3-image { @include bg-image-mixin('icon3.png', 'foobar', $inline:true); }

// Scalable
@mixin icon4-image { @include scalable-icon-mixin('icon4.svg', 'foobar'); }

//-- How to use it
.logo {
	@include logo1-image;
}
```
