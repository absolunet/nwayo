#debug  = require 'gulp-debug'
gulp   = require 'gulp'
rename = require 'gulp-rename'

util = require './_util'
path = util.path



#-- Lint JS
gulp.task 'scripts_lint', ->
	jshint  = require 'gulp-jshint'
	stylish = require 'jshint-stylish'

	return gulp.src path.files.scripts_lint
		.pipe jshint()
		.pipe jshint.reporter(stylish)
		.pipe jshint.reporter('fail')



#-- Compile
gulp.task 'scripts_compile', ['scripts_lint'], ->
	include = require 'gulp-nwayo-include'
	replace = require 'gulp-replace'
	uglify  = require 'gulp-uglify'

	return gulp.src path.files.bundles_scripts
		.pipe include basePath: './', autoExtension:true
		.pipe replace util.token_regexp, util.token_replace
		.pipe uglify()
		.pipe gulp.dest path.dir.build_scripts


#-- Rebuild
gulp.task 'scripts', (cb) ->
	del         = require 'del'
	runsequence = require 'run-sequence'

	del [path.dir.build_scripts], force:true, ->
		runsequence 'scripts_lint', 'scripts_compile', cb
