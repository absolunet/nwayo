# "gulp-imagemin": "0.5.0",
# "gulp-jshint": "~1.5.5",
# "gulp-uglify": "~0.2.1"


#es     = require 'event-stream'
gulp   = require 'gulp'

#imagemin = require 'gulp-imagemin'
#jshint   = require 'gulp-jshint'
#uglify   = require 'gulp-uglify'

build = '../build'
common = '../common'
assets = "#{common}/assets"
bundles = "#{common}/bundles"



gulp.task 'css', ->
	sq     = require 'streamqueue'
	concat = require 'gulp-concat'
	#scsslint  = require 'gulp-scss-lint'
	compass   = require 'gulp-compass'
	minifycss = require 'gulp-minify-css'
	stream    = sq objectMode:true

	# lint files
	#gulp.src "#{sources}/css/**/*.scss"
	#	.pipe scsslint()

	# build
	#stream.queue(
	#	gulp.src "#{sources}/css/libs/normalize.css"
	#)

	stream.queue(
		gulp.src "#{bundles}/primary-core.scss"
			.pipe compass
				config_file: 'config.rb',
	)

	return stream.done()
		.pipe concat "core.css"
#		.pipe minifycss()
		.pipe gulp.dest "#{build}/common/css"






gulp.task 'watch', ->
	gulp.watch "#{sources}/styles/**/*.{scss,css}", ['css']


	





# gulp.task 'default', ->
# 
# 	console.log 'yahoo'

# var paths = {
#   scripts: ['client/js/**/*.coffee', '!client/external/**/*.coffee'],
#   images: 'client/img/**/*'
# };
# 
# gulp.task('scripts', function() {
#   // Minify and copy all JavaScript (except vendor scripts)
#   return gulp.src(paths.scripts)
#     .pipe(coffee())
#     .pipe(uglify())
#     .pipe(concat('all.min.js'))
#     .pipe(gulp.dest('build/js'));
# });
# 
# // Copy all static images
# gulp.task('images', function() {
#  return gulp.src(paths.images)
#     // Pass in options to the task
#     .pipe(imagemin({optimizationLevel: 5}))
#     .pipe(gulp.dest('build/img'));
# });
# 
# // Rerun the task when a file changes
# gulp.task('watch', function() {
#   gulp.watch(paths.scripts, ['scripts']);
#   gulp.watch(paths.images, ['images']);
# });
# 
# // The default task (called when you run `gulp` from cli)
# gulp.task('default', ['scripts', 'images', 'watch']);

