#debug  = require 'gulp-debug'
gulp   = require 'gulp'
rename = require 'gulp-rename'

util  = require '../config/util'
path  = util.path()




#-- Fonts copy
gulp.task 'assets_fonts', ->
	return gulp.src path.files.fonts_copy, base:path.dir.root
		.pipe rename util.assets_rename
		.pipe gulp.dest path.dir.build



#-- Icons
gulp.task 'assets_icons', ->



#-- Raw copy
gulp.task 'assets_raw', ->
	return gulp.src path.files.raw, base:path.dir.root
		.pipe rename util.assets_rename
		.pipe gulp.dest path.dir.build



#-- Rebuild
gulp.task 'assets', (cb) ->
	del         = require 'del'
	runsequence = require 'run-sequence'

	del [path.dir.build_assets, path.files.build_icons], force:true, ->
		runsequence ['assets_fonts', 'assets_icons', 'assets_raw'], cb
