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


#-- Convert constants to JS
gulp.task 'scripts_constants', ->
	data = util.konstan('scripts')
	data.projectname  = util.pkg.name
	data.nwayoversion = util.pkg.nwayo.version

	return util.vinyl_stream 'konstan.js', "var konstan=#{JSON.stringify data};"
		.pipe gulp.dest path.dir.cache



#-- Compile
gulp.task 'scripts_compile', ['scripts_lint', 'scripts_constants'], ->
	include = require 'gulp-nwayo-include'
	replace = require 'gulp-replace'
	uglify  = require 'gulp-uglify'

	return gulp.src path.files.bundles_scripts
		.pipe include basePath: './', autoExtension:true
#		.pipe uglify()
		.pipe gulp.dest path.dir.build_scripts


#-- Rebuild
gulp.task 'scripts', (cb) ->
	del         = require 'del'
	runsequence = require 'run-sequence'

	del [path.dir.build_scripts], force:true, ->
		runsequence 'scripts_compile', cb
