#debug  = require 'gulp-debug'
gulp   = require 'gulp'
rename = require 'gulp-rename'

util = require './_util'
path = util.path()




#-- Fonts copy
gulp.task 'assets_fonts', ->
	return gulp.src path.files.fonts_copy, base:path.dir.root
		.pipe rename util.assets_rename
		.pipe gulp.dest path.dir.build



#-- Images optimization
gulp.task 'assets_images_optimization', ->
	imagemin = require 'gulp-imagemin'

	# optimize
	return gulp.src path.files.images, base:path.dir.root
		.pipe imagemin util.imagemin_params()
		.pipe rename util.assets_rename
		.pipe gulp.dest path.dir.build



#-- High density images generation
gulp.task 'assets_images_highdensity', ->
	imagemin = require 'gulp-imagemin'
	gm       = require 'gulp-gm'

	# high density
	return gulp.src path.files.images2x, base:path.dir.root
		.pipe gm (gmfile, done) ->
			gmfile.identify (err, info) ->
				util.gm_optimization gmfile.resize('50%','50%'), info
				done null, gmfile

		.pipe rename (path) ->
			path = util.assets_rename path, true
			path.basename = path.basename.slice(0,-3)
			return

		.pipe imagemin util.imagemin_params()
		.pipe gulp.dest path.dir.build



#-- Raw copy
gulp.task 'assets_raw', ->
	return gulp.src path.files.raw, base:path.dir.root
		.pipe rename util.assets_rename
		.pipe gulp.dest path.dir.build






#-- Rebuild images
gulp.task 'assets_images', (cb) ->
	del         = require 'del'
	runsequence = require 'run-sequence'

	del [path.dir.build_images], force:true, ->
		runsequence ['assets_images_optimization', 'assets_images_highdensity'], cb



#-- Rebuild
gulp.task 'assets', (cb) ->
	del         = require 'del'
	runsequence = require 'run-sequence'

	del [path.dir.build_assets, path.files.build_icons], force:true, ->
		runsequence ['assets_fonts', 'assets_images', 'assets_raw'], cb
