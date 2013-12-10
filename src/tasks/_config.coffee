module.exports = (grunt) ->
	grunt.task.loadNpmTasks task for task in [
		'grunt-contrib-watch'
		'grunt-prompt'
	]

	path = {
		tmp: 'src/.tmp-nwayo'
		skeleton:
			root:              'src/.tmp-nwayo/.skeleton'
			base:              'src/.tmp-nwayo/.skeleton/base'
			foundation:        'src/.tmp-nwayo/.skeleton/foundation'
			foundation_drupal: 'src/.tmp-nwayo/.skeleton/foundation-drupal'
			tmp_vendor:        'src/.tmp-nwayo/.skeleton/vendor'

		src:
			nwayo: 'src/nwayo'
			tasks: 'src/tasks'
			tmpl:  'src/tmpl'

		out:
			root: '.'
			dist: 'dist'


	}

	util = {
		copy:   (src,dest,filter='**') -> grunt.file.copy src+file, dest+file for file in grunt.file.expand { cwd:src, filter:'isFile' }, filter		
		delete: (src...) -> grunt.file.delete file, {force:true} for file in grunt.file.expand { cwd:path.out.root }, pattern for pattern in src
	}




	grunt.config.set name, data for name, data of {
		'util': util

		'internal': 
			path:   path
			pkg:    grunt.file.readJSON 'package.json'
			config: grunt.file.readJSON path.src.tasks+'/json/config.json'


		'watch.all':
			files: ['gruntfile.js']
			tasks: 'default'
	}


	grunt.task.registerTask 'default', [
		#'skeleton'
		#'dependencies'
		#'flavour'
		'doc'
	]


	#"grunt-preprocess":   "~3.0.1",
	#"grunt-contrib-copy": "~0.4.1",
	#"grunt-curl":         "~1.2.1",
	#"grunt-zip":          "~0.10.0"
