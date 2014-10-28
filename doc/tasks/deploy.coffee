#debug  = require 'gulp-debug'
gulp   = require 'gulp'
deploy = require 'gulp-gh-pages'

#-- Deploy to Github Pages
gulp.task 'deploy', ->
    gulp.src './doc/dist/**/*'
        .pipe deploy()
