#debug  = require 'gulp-debug'
gulp       = require 'gulp'
preprocess = require 'gulp-preprocess'
rename     = require 'gulp-rename'
pkg        = require '../../package'

#-- Generate files
gulp.task 'files', ->

	gulp.src './doc/templates/*.md'
		.pipe preprocess context: {
			package:     pkg.name
			description: pkg.description
			definition:  pkg.definition
			repo:        "https://github.com/absolunet/#{pkg.name}"
			repo_url:    "https://github.com/absolunet/#{pkg.name}/blob/master"
			doc:         false
			homepage:    pkg.homepage
			author:      pkg.author.name
			site:        pkg.author.url
			year:        new Date().getFullYear()
		}

		.pipe rename (path) ->
			path.basename = path.basename.toUpperCase()
			return false

		.pipe gulp.dest './'
