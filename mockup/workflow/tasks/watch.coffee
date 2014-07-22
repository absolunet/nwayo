gulp = require 'gulp'

util = require '../config/util'
path = util.path()



#-- Watch
gulp.task 'watch', ->

	# styles
	gulp.watch [path.files.fonts],                             ['styles_fonts',  'styles_scss']
	gulp.watch [path.files.inline],                            ['styles_inline', 'styles_scss']
	gulp.watch [path.files.bundles_styles, path.files.styles], ['styles_scss']
