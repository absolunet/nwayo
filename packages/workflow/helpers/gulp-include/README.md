# @absolunet/gulp-include

[![NPM version](https://img.shields.io/npm/v/@absolunet/gulp-include.svg)](https://www.npmjs.com/package/@absolunet/gulp-include)
[![Travis build](https://api.travis-ci.org/absolunet/gulp-include.svg?branch=master)](https://travis-ci.org/absolunet/gulp-include/builds)
[![Dependencies](https://david-dm.org/absolunet/gulp-include/status.svg)](https://david-dm.org/absolunet/gulp-include)
[![Dev dependencies](https://david-dm.org/absolunet/gulp-include/dev-status.svg)](https://david-dm.org/absolunet/gulp-include?type=dev)

>Makes inclusion of files a breeze.
Enables functionality similar to that of snockets / sprockets or other file insertion compilation tools.
(Extends gulp-include with custom rendering of inclusion)

> Made for gulp 3


## Usage
First, install `gulp-include` as a dev dependency:
`npm install --save-dev @absolunet/gulp-include`

Then, add your _include-comments_ to your file.
_People who have experience with `sprockets` or `snockets` will feel at home._


An _include-comment_ looks like this:
```javascript
//= include relative/path/to/file.js
```
or if you want to get crazy, a glob pattern like so:
```javascript
//= include relative/path/to/directory/*.js
```

or to get even crazier, an array glob similar to commonly used in GruntJS:
```javascript
//= include ['app/someFramework.js', 'app/**/*.js', '!app/vendor/**/*', 'app/someLibrary.js']
```

(Note: for those of you unfamiliar with the above syntax, check out https://github.com/isaacs/node-glob
or http://gruntjs.com/configuring-tasks#globbing-patterns)

You can do all of this in any language, the only requirement is that the first character
 on the line after any #, /, or white space characters is an equal sign.
```coffeescript
#= require_tree relative/path/to/directory
```
`gulp-include` disregards whitespace, as long as the comment-line starts with a _newline_ followed `=` and contains `include`, `require` or `include_tree`, `require_tree`.

This plugin recursively expand files it includes, so you can nest includes inside of files that
    were themselves included. IE:

`main.js`:
```
//= include included_file.js
```

`included_file.js`:
```
//= include recursive_include.js
```
And so on recursively to an arbitrary depth.

The example below compiles a several coffee-files and js-files into a single js-file:

`app.coffee`:

```coffeescript
`
//= require vendor/jquery.js
//= require vendor/modernizr.js
`

#= require controllers/AppController.coffee
#= require_tree views

class Main extends AppController
	constructor: ->
		console.log "This is main!"

window.main = new Main()
```
*Note:* The example above uses backticks (\`) to allow `gulp-coffee` to compile inline javascript

`gulpfile.js`:

```javascript
var gulp		= require('gulp'),
	include		= require('@absolunet/gulp-include'),
	coffee		= require('gulp-coffee');

gulp.task("scripts", function() {
	gulp.src('src/js/app.coffee')
		.pipe( include() )
		.pipe( coffee() )
		.pipe( gulp.dest("dist/js") )
});

gulp.task("default", "scripts");
```


### jshtml
```javascript
//= jshtml relative/path/to/file
```
or if you want to get a directory
```javascript
//= jshtml_directory relative/path/to/directory
```

#### Example
The example below compiles several jsrender files into a single js-file:

`app.js`:

```javascript
//= jshtml common/templates/item
//= jshtml_directory cart/templates

app.tmpl.common_item.render();
app.tmpl.cart_list1.render();
```


## Options
* `extensions` (optional)
	* Takes a `String` or an `Array` of extensions, eg: `"js"` or `["js", "coffee"]`
	* If set, all inclusions that does not match the extension(s) will be ignored
* `basePath` (optional)
	* Takes a `String` path
	* If set, all inclusions will be based from the `basePath` instead of being relative to the file
* `autoExtension` (optional)
	* Takes a `Boolean`
	* If set, all inclusions will automatically have the current file extension added to them
* `partialPrefix` (optional)
	* Takes a `Boolean`
	* If set, all inclusions will be tried with an underscore-prefixed filename (SASS style)
* `fileProcess` (optional)
	* Takes a `Function`
	* If set, will be called back with the file content to be processed an returned


## Documentation
Visit the [http://absolunet.github.io/nwayo](http://absolunet.github.io/nwayo) website for all the things.

## Release history
Forked from gulp-include [v1.1.0](https://github.com/wiledal/gulp-include/commit/c1e06c2c6ba76af9f00548675b817719a90a9f86)

## License
See the [license](https://github.com/absolunet/gulp-include/blob/master/license).
