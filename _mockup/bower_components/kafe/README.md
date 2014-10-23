<p align="center">
	<a href="http://absolunet.github.io/kafe">
		<img src="http://absolunet.github.io/kafe/assets/logo-kafe.svg" width="180" height="180" alt="kafe">
	</a>
</p>

# kafe ![Bower version][bower-image] 
#### Mixing javascript crops for a perfect flavour.
> /kæfˈeɪ/ (haitian creole) A beverage made by infusing the beans of the coffee plant in hot water.

## Installation
```bash
bower install kafe
```

## Dependencies
- [jQuery](http://jquery.com/)
- [Lo-Dash](http://lodash.com/)
- [Underscore.string](http://epeli.github.io/underscore.string/)
- [Modernizr](http://modernizr.com/)


## Usage

### Grunt
Use [grunt-includes](https://www.npmjs.org/package/grunt-includes)
```js
options: {
    includeRegexp:  /^\s*\/\/\=\srequire\s'([^']+)'\s*/,
    duplicates:     false,
    filenameSuffix: '.js',
    includePath:    './'
}
```

### Gulp
Use [gulp-include](https://www.npmjs.org/package/gulp-include)
```js
.pipe( include({
	basePath: './',
	autoExtension: true
}) )
```

### Standalone
Use the `//= require 'FILENAME'` in the file header to know which files to include manually.


## Documentation
Visit the [http://absolunet.github.io/kafe](http://absolunet.github.io/kafe) website for all the things.
## Release history
See the [CHANGELOG](https://github.com/absolunet/kafe/tree/master/CHANGELOG.md).

## License 
See the [LICENSE](https://github.com/absolunet/kafe/tree/master/LICENSE.md).


[bower-image]: http://img.shields.io/bower/v/kafe.svg?style=flat
