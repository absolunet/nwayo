module.exports = (grunt) ->
	preprocess = require 'preprocess'

	path = grunt.config.get 'internal.path'
	pkg  = grunt.config.get 'internal.pkg'

	src = path.src.tmpl
	out = path.out.root


	# doc
	grunt.task.registerTask 'doc', '', ()-> 
		data = {
			package:     pkg.name
			version:     pkg.version
			description: pkg.description
			definition:  pkg.definition
			repo:        "https://github.com/absolunet/#{pkg.name}"
			repo_url:    "https://github.com/absolunet/#{pkg.name}/blob/master"
			homepage:    pkg.homepage
			doc:         false
			year:        grunt.template.today 'yyyy'
			author:      pkg.author.name
			site:        pkg.author.url
		}

		preprocess.preprocessFileSync "#{src}/readme.tmpl",  "#{out}/README.md",  data
		preprocess.preprocessFileSync "#{src}/license.tmpl", "#{out}/LICENSE.md", data

		grunt.file.copy "#{src}/changelog.tmpl", "#{out}/CHANGELOG.md"
		
		grunt.log.ok 'Base documentation generated.'

