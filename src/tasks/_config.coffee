module.exports = (grunt) ->
	os = require 'os'
	inquirer = require 'inquirer'

	grunt.task.loadNpmTasks task for task in [
		'grunt-contrib-watch'
	]

	tmp = (if os.tmpdir then os.tmpdir() else os.tmpDir()) + 'nwayo-builder'

	path = {
		tmp: tmp
		skeleton:
			root:              tmp+'/_skeleton'
			base:              tmp+'/_skeleton/base'
			foundation:        tmp+'/_skeleton/foundation'
			foundation_drupal: tmp+'/_skeleton/foundation-drupal'
			tmp_vendor:        tmp+'/_skeleton/vendor'

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






	grunt.task.registerTask 'default', '', () ->
		done = this.async()

		console.log ''
		inquirer.prompt [
			name:    'task'
			message: 'What can I do for you today ?'
			type:    'list'
			choices: [
				new inquirer.Separator(' ')
				{ name:'Build a custom flavour', value:'custom_flavour' }
				{ name:'Build defaut flavours', value:'default_flavours' }
				new inquirer.Separator()
				{ name:'Generate documentation', value:'doc' }
			]
		], (data) -> grunt.task.run data.task; done()

