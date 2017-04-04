# Inline image
Les images sont situées sous le dossier `inline-images`, sous la composante associée à l'image en question.

## Mixin
Le mixin utilisé pour générer les images au niveau du css. Il sera ensuite possible de les inclure par `@include` sous le sélecteur voulu.

## Fonctionnement

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
- `$file` = Le nom du fichier image.
- `$context` = Le contexte dans lequel se situe l'image.
- `$inline` = Si l'image est inline ou non.
- `$width` = Assigner la largeur d'une image @2x.
- `$height` = Assigner la hauteur d'une image @2x.
- `$color` = La couleur utilisée pour les svg.

Il est aussi possible d'utiliser `scalable-icon-mixin` pour les icônes et ainsi avoir des style de base pour les différentes propriétés de background importantes.

```scss
//-- Scalable icon
@mixin scalable-icon-mixin ($file, $context, $color:false) {
	@include bg-image-mixin($file, $context, $inline:true, $color:$color);
	background-position: center center;
	background-repeat: no-repeat;
	background-size: contain;
}
```

## Comment utiliser
Pour générer le bon code, vous devez au moins fournir `$file` et `$context`. La variable `$inline` est nécessaire lors de l'utilisation au niveau du `bg-image-mixin`. Pour le mixin `scalable-icon-mixin`, la variable `$inline` est automatiquement ajouté à `true`.

```scss
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

Pour générer un svg d'une ou plusieurs couleurs, le svg doit absolument conrresponde à l'une de ces options.
1. **Couleur simple**: la couleur passé en paramètre remplacera la couleur `#BA0BAB` du svg.
2. **Liste**: deux couleurs doivent être passé en paramètre sous ce format `($firstColor, $secondColor)`. Ces couleurs remplaceront les couleurs du svg dans l'ordre `#BA0BAB`, `#C0FFEE`.
3. **Hash**: À l'aide d'un map auquel la valeur remplacera la key. `(key1: value1, key2: value2, key3: value3)`

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
