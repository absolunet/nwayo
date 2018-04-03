# Images
Les images sont situées sous le dossier `images`, sous la composante associée à l'image en question.

## Mixin
Le mixin utilisé pour générer les images au niveau du css. Il sera ensuite possible de les inclure par `@include` sous le sélecteur voulu.
**Note:** Le fonctionnement des images `inline` et `Scalable` seront traitées dans la section [inline-image](inline-image.md)

## Fonctionnement
```scss
//-- Background image
@mixin bg-image-mixin ($file, $context, $inline:false, $width:false, $height:false, $color:false) {
	
	// uri
	$uri: '';
	@if $inline {
		// Portion détaillé dans la section inline-image
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
- `$file` = Le nom du fichier image.
- `$context` = Le contexte dans lequel se situe l'image.
- `$inline` = Si l'image est inline ou non.
- `$width` = Assigner la largeur d'une image @2x.
- `$height` = Assigner la hauteur d'une image @2x.
- `$color` = La couleur utilisée pour les svg. Voir la section [inline-image](inline-image.md) pour plus de détails.

## Comment utiliser
Pour générer le bon code, vous devez au moins fournir `$file` et `$context`.
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

//-- Appel dans le css
.logo {
	@include logo1-image;
}
```
