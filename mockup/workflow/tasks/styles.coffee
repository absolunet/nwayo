gulp   = require 'gulp'
debug  = require 'gulp-debug'
rename = require 'gulp-rename'
#es    = require 'event-stream'

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
	###
	scsslint = require 'gulp-scss-lint'

	return gulp.src styles
		.pipe scsslint()  
	###



#-- SCSS
gulp.task 'styles_scss', ['styles_lint'], ->
	sq        = require 'streamqueue'
	concat    = require 'gulp-concat'
	compass   = require 'gulp-compass'
	minifycss = require 'gulp-minify-css'
	stream    = new sq objectMode:true

	# "gulp-imagemin": "0.5.0",
	#imagemin = require 'gulp-imagemin'


	# build
	#stream.queue(
	#	gulp.src "#{sources}/css/libs/normalize.css"
	#)

	stream.queue(
		gulp.src "#{path.dir.bundles}/primary-core.scss"
			.pipe compass
				config_file: path.config.compass
	)
	return stream.done()
		.pipe concat 'core.css'
		#.pipe minifycss()
		.pipe gulp.dest "#{path.dir.build}/styles"



#-- Rebuild
gulp.task 'styles', ['styles_fonts', 'styles_images', 'styles_scss']

