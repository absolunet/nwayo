#debug  = require 'gulp-debug'
gulp   = require 'gulp'
rename = require 'gulp-rename'

util  = require '../config/util'
path  = util.path()




#-- Fonts copy
gulp.task 'assets_fonts', ->
	gulp.src path.files.fonts_copy, base:path.dir.root
		.pipe rename util.assets_rename
		.pipe gulp.dest path.dir.build



#-- Images optimization
gulp.task 'assets_images', ->
	imagemin = require 'gulp-imagemin'
	gm       = require 'gulp-gm'

	# optimize
	gulp.src path.files.images, base:path.dir.root
		.pipe imagemin util.imagemin_params()
		.pipe rename util.assets_rename
		.pipe gulp.dest path.dir.build


	# high density
	resize2to1 = (gmfile) -> gmfile.resize('50%',' 50%') # QUALITY !!!!

	gulp.src path.files.images2x, base:path.dir.root
		.pipe gm resize2to1, imageMagick:true
		.pipe rename (path) -> 
			path.basename = path.basename.slice(0,-3)
			return
		.pipe imagemin util.imagemin_params()
		.pipe rename util.assets_rename
		.pipe gulp.dest path.dir.build




#-- Rebuild
gulp.task 'assets', ['assets_fonts', 'assets_images']
