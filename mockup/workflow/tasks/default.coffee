#debug  = require 'gulp-debug'
gulp   = require 'gulp'
rename = require 'gulp-rename'

util  = require '../config/util'
path  = util.path()




#-- Rebuild
gulp.task 'rebuild', ['assets', 'styles']


## Menu with choices
