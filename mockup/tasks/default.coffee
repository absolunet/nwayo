#debug  = require 'gulp-debug'
gulp   = require 'gulp'
rename = require 'gulp-rename'

util = require './_util'
path = util.path()




#-- Rebuild
gulp.task 'rebuild', (cb) ->
	runsequence = require 'run-sequence'
	runsequence ['assets', 'styles'], cb






## Menu with choices
