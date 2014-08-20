#debug  = require 'gulp-debug'
gulp   = require 'gulp'
rename = require 'gulp-rename'

util  = require '../config/util'
path  = util.path()




#-- Inline images optimization
gulp.task 'styles_images', ->
	imagemin = require 'gulp-imagemin'

	return gulp.src path.files.inline, base:path.dir.root
		.pipe imagemin util.imagemin_params()
		.pipe rename util.assets_rename
		.pipe gulp.dest path.dir.cache



#-- Lint SCSS
gulp.task 'styles_lint', ->
	scsslint = require 'gulp-scsslint'

	return gulp.src path.files.styles
		.pipe scsslint({
			config: path.config.scsslint
		})
		.pipe scsslint.reporter()
		.pipe scsslint.reporter('fail')



#-- Compile
gulp.task 'styles_compile', ['styles_lint'], ->
	sass         = require 'gulp-ruby-sass'
	sourcemaps   = require 'gulp-sourcemaps'
	autoprefixer = require 'gulp-autoprefixer'
	minifycss    = require 'gulp-minify-css'

	return gulp.src path.files.bundles_styles
		.pipe sass
			loadPath: path.dir.root
			compass: true
#			sourcemap: false
#			sourcemapPath: '../..'
#		.pipe sourcemaps.init loadMaps:true
		.pipe autoprefixer('last 2 versions', '> 1%', 'ie >= 9')
		.pipe minifycss()
#		.pipe sourcemaps.write './',
#			addComment: true
#			includeContent: false
		.pipe gulp.dest "#{path.dir.build}/styles"



#-- Rebuild
gulp.task 'styles', (cb) ->
	del         = require 'del'
	runsequence = require 'run-sequence'

	del [path.dir.build_styles, path.dir.cache_inline], force:true, ->
		runsequence ['images', 'styles_images'], 'styles_compile', cb
