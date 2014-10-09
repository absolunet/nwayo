gulp = require 'gulp'

util = require './_util'
path = util.path()



#-- Watch
gulp.task 'watch', ->

	# assets
	gulp.watch [path.files.fonts], ['assets_fonts', 'styles_compile']
	gulp.watch [path.files.images], ['assets_images']
	gulp.watch [path.files.raw], ['assets_raw']

	# icons
	gulp.watch [path.files.icons_favicon],  ['icons_favicon']
	gulp.watch [path.files.icons_favtouch], ['icons_favtouch']

	# scripts
	gulp.watch [path.files.bundles_scripts, path.files.scripts, path.files.dependencies_scripts], ['scripts_compile']

	# styles
	gulp.watch [path.files.inline], ['styles_inline', 'styles_compile']
	gulp.watch [path.files.bundles_styles, path.files.styles, path.files.dependencies_styles], ['styles_compile']
