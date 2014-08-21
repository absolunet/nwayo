gulp = require 'gulp'

util = require '../config/util'
path = util.path()



#-- Watch
gulp.task 'watch', ->

	# assets
	gulp.watch [path.files.fonts], ['assets_fonts', 'styles_compile']
	gulp.watch [path.files.build_icons], ['assets_icons']
	gulp.watch [path.files.raw], ['assets_raw']

	# images
	gulp.watch [path.files.images], ['images']

	# styles
	gulp.watch [path.files.inline], ['styles_inline', 'styles_compile']
	gulp.watch [path.files.bundles_styles, path.files.styles, path.files.dependencies_styles], ['styles_compile']
