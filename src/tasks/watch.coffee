gulp = require 'gulp'

util = require './_util'
path = util.path



#-- Watch
gulp.task 'watch', ->

	# assets
	gulp.watch [path.files.fonts], ['assets_fonts']
	gulp.watch [path.files.images], ['assets_images']
	gulp.watch [path.files.raw], ['assets_raw']

	# icons
	gulp.watch [path.files.icons_favicon], ['icons_favicon']
	gulp.watch [path.files.icons_icon, path.files.icons_large], ['icons_share']
	gulp.watch [path.files.icons_tile], ['icons_tile']

	# scripts
	gulp.watch [path.files.bundles_scripts, path.files.scripts, path.files.templates, path.config.package], ['scripts_compile']

	# styles
	gulp.watch [path.files.inline], ['styles_images', 'styles_compile']
	gulp.watch [path.files.bundles_styles, path.files.styles, path.config.package], ['styles_compile']
