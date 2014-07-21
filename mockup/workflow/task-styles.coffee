console.log path.sources
path.styles = 
	root:    "#{path.sources}/styles"
	bundles: "#{path.sources}/styles/bundles"
	fonts:   "#{path.assets}/fonts"
	inline:  "#{path.assets}/inline-images"

gulp.task 'styles', ->
	sq        = require 'streamqueue'
	concat    = require 'gulp-concat'
	#scsslint  = require 'gulp-scss-lint'
	compass   = require 'gulp-compass'
	minifycss = require 'gulp-minify-css'
	stream    = sq objectMode:true

	# "gulp-imagemin": "0.5.0",
	#imagemin = require 'gulp-imagemin'


	# lint files
	#gulp.src "#{sources}/css/**/*.scss"
	#	.pipe scsslint()

	# build
	#stream.queue(
	#	gulp.src "#{sources}/css/libs/normalize.css"
	#)

	stream.queue(
		gulp.src "#{path.common}/styles/bundles/primary-core.scss"
			.pipe compass
				config_file: 'config.rb',
	)

	return stream.done()
		.pipe concat "core.css"
#		.pipe minifycss()
		.pipe gulp.dest "#{path.build}/common/css"






gulp.task 'watch', ->
	gulp.watch "#{path.styles.root}/**/*.{scss,css}", ['styles']

