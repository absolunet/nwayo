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



#-- SCSS
gulp.task 'styles_scss', ['styles_lint'], ->
	concat    = require 'gulp-concat'
	compass   = require 'gulp-compass'
	minifycss = require 'gulp-minify-css'

	gulp.src "#{path.dir.bundles}/primary-core.scss"
		.pipe compass
			config_file: path.config.compass
		.pipe concat 'core.css'
		#.pipe minifycss()
		.pipe gulp.dest "#{path.dir.build}/styles"




#-- Rebuild
gulp.task 'styles', ['styles_fonts', 'styles_images', 'styles_scss']

