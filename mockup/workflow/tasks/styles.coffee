gulp   = require 'gulp'
debug  = require 'gulp-debug'
rename = require 'gulp-rename'

util  = require '../config/util'
path  = util.path()




#-- Fonts copy
gulp.task 'styles_fonts', ->
	gulp.src path.files.fonts_copy, base:path.dir.root
		.pipe rename util.assets_rename
		.pipe gulp.dest path.dir.build



#-- Inline images optimization
gulp.task 'styles_images', ->
	imagemin = require 'gulp-imagemin'

	gulp.src path.files.inline, base:path.dir.root
		.pipe imagemin util.imagemin_params()
		.pipe rename util.assets_rename
		.pipe gulp.dest path.dir.cache



#-- Lint SCSS
gulp.task 'styles_lint', ->
	scsslint = require 'gulp-scsslint'

	gulp.src path.files.styles
		.pipe scsslint({
			config: path.config.scsslint
		})
		.pipe scsslint.reporter()
		.pipe scsslint.reporter('fail')



#-- Compile via Compass
gulp.task 'styles_compass', ['styles_lint'], ->
	compass    = require 'gulp-compass'
	minifycss  = require 'gulp-minify-css'
	sourcemaps = require 'gulp-sourcemaps'

	gulp.src path.files.bundles_styles
		.pipe compass
			config_file: path.config.compass
			css: '../build/styles'
			sass: '../common/bundles'
			sourcemap: true
		.on('error', ->)

		.pipe sourcemaps.init loadMaps:true
		.pipe minifycss()
		.pipe sourcemaps.write './',
			addComment: true
			includeContent: false
		.pipe gulp.dest "#{path.dir.build}/styles"



#-- Minify
gulp.task 'styles_process', ['styles_compass'], ->



	###
	minifycss  = require 'gulp-minify-css'
	sourcemaps = require 'gulp-sourcemaps'

	gulp.src "#{path.dir.build}/styles/*.css"
		.pipe sourcemaps.init loadMaps:true
		.pipe minifycss()
		.pipe sourcemaps.write './',
			addComment: true
			includeContent: false
		.pipe gulp.dest "#{path.dir.build}/styles"
	###



#-- Rebuild
gulp.task 'styles', ['styles_fonts', 'styles_images', 'styles_minify']
