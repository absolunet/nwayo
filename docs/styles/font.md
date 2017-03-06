# Polices
Les polices sont situées sous le dossier `fonts`, sous la composante associée à la police en question.
Il faut les 4 formats de police sous le dossier `fonts` avec le même nom de fichier:
- `eot`
- `ttf`
- `woff`
- `woff2`

## Mixin
Le mixin utilisé pour générer le `@font-face`au niveau du css.
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
- `$name` = Le nom de la police utilisé pour la `font-family` dans le css.
- `$filename` = Le nom du fichier de la police.
- `$context` = Le contexte dans lequel se situe la police.
- `$weight` = Le poids de la police. `normal` est mis par défaut.
- `$style` = Le style de la police. `normal` est mis par défaut.

## Comment utiliser
Pour générer le bon code, vous devez au moins fournir `$name`, `$filename`, `$context`.
```scss
//-- Ligne de code appelé pour générer la font-family
@include load-font-mixin('roboto', 'roboto-light-webfont', 'common', $weight:$light-weight);

//-- Utilisation au niveau d'une variable
$text-font: 'Open Sans', sans-serif;
```

## Gestion de font-weight
Il est préférable d'avoir une police pour chacune des graisses utilisées dans la composante et d'utiliser le même `$name`pour chacun d'eux. Il est ainsi plus facile de gérer la graisse de manière globale.
```scss
//-- Chargement des différentes graisses
@include load-font-mixin('roboto', 'roboto-light-webfont', 'common', $light-weight);
@include load-font-mixin('roboto', 'roboto-regular-webfont', 'common', $normal-weight);
@include load-font-mixin('roboto', 'roboto-bold-webfont', 'common', $bold-weight);
@include load-font-mixin('roboto', 'roboto-black-webfont', 'common', $black-weight);

//-- Appel dans le css
$text-font: 'roboto', sans-serif;

body {
	font-family: $text-font;
	font-weight: $light-weight;
}

h1 {
	font-weight: $black-weight;
}
```
