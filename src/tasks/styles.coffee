#debug  = require 'gulp-debug'
gulp   = require 'gulp'
rename = require 'gulp-rename'

util = require './_util'
path = util.path




#-- Inline images optimization
gulp.task 'styles_images', ->
	imagemin = require 'gulp-imagemin'

	return gulp.src path.files.inline, base:path.dir.root
		.pipe imagemin util.imagemin_params()
		.pipe rename (path) -> path.dirname = util.assets_rename path.dirname; return
		.pipe gulp.dest path.dir.cache



#-- Lint SCSS
gulp.task 'styles_lint', ->
	scsslint = require 'gulp-scsslint'

	return gulp.src path.files.styles_lint
		.pipe scsslint({
			config: path.config.scsslint
		})
		.pipe scsslint.reporter()
		.pipe scsslint.reporter('fail')



#-- Compile
gulp.task 'styles_compile', ['styles_lint'], ->
	sass         = require 'gulp-ruby-sass'
	autoprefixer = require 'gulp-autoprefixer'
	replace      = require 'gulp-replace'
	minifycss    = require 'gulp-minify-css'

	return gulp.src path.files.bundles_styles
		.pipe sass
			loadPath: path.dir.root
			cacheLocation: path.dir.cache_sass
			compass: true
			trace: true
			'sourcemap=none': true # horrible temporary patch
		.pipe autoprefixer('last 2 versions', '> 1%', 'ie >= 9')
		.pipe replace util.token_regexp, util.token_replace
#		.pipe minifycss()
		.pipe gulp.dest path.dir.build_styles



#-- Rebuild
gulp.task 'styles', (cb) ->
	del         = require 'del'
	runsequence = require 'run-sequence'

	del [path.dir.build_styles, path.dir.cache_inline, path.dir.cache_sass], force:true, ->
		runsequence 'styles_images', 'styles_compile', cb
