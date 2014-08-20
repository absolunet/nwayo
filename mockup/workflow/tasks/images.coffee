#debug  = require 'gulp-debug'
gulp   = require 'gulp'
rename = require 'gulp-rename'

util  = require '../config/util'
path  = util.path()




#-- Images optimization
gulp.task 'images_optimization', ->
	imagemin = require 'gulp-imagemin'

	# optimize
	return gulp.src path.files.images, base:path.dir.root
		.pipe imagemin util.imagemin_params()
		.pipe rename util.assets_rename
		.pipe gulp.dest path.dir.build



#-- High density images generation
gulp.task 'images_highdensity', ->
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



#-- Rebuild images
gulp.task 'images', (cb) ->
	del         = require 'del'
	runsequence = require 'run-sequence'

	del [path.dir.build_images], force:true, ->
		runsequence ['images_optimization', 'images_highdensity'], cb
