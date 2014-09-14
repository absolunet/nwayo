module.exports = (grunt) ->
	os       = require 'os'
	inquirer = require 'inquirer'
	progress = require 'progress'

	tmp = (if os.tmpdir then os.tmpdir() else os.tmpDir()) + 'nwayo-builder'

	path = {
		tmp: tmp
		skeleton:
			root:              "#{tmp}/_skeleton"
			base:              "#{tmp}/_skeleton/base"
			foundation:        "#{tmp}/_skeleton/foundation"
			foundation_drupal: "#{tmp}/_skeleton/foundation-drupal"
			tmp_vendor:        "#{tmp}/_skeleton/vendor"

		src:
			nwayo: 'src/nwayo'
			tasks: 'src/tasks'
			tmpl:  'src/tmpl'

		out:
			root: '.'
	}

	util = {
		copy:          (src,dest,filter='**') -> grunt.file.copy src+file, dest+file for file in grunt.file.expand { cwd:src, filter:'isFile' }, filter		
		delete:        (src...) -> grunt.file.delete file, {force:true} for file in grunt.file.expand { cwd:path.out.root }, pattern for pattern in src
		progress:      (action,nb) -> grunt.log.writeln "#{action} #{nb.toString().cyan} files..."; return new progress '[:bar] :percent (:elapseds)', { total:nb, width:20, incomplete:' ', clear:true }
		progress_done: (bar) -> bar.terminate(); grunt.log.ok "Completed in #{((new Date() - bar.start) / 1000).toFixed(1)}s"; grunt.log.writeln()
	}




	grunt.config.set name, data for name, data of {
		'util': util

		'internal': 
			path:   path
			pkg:    grunt.file.readJSON 'package.json'
			config: grunt.file.readJSON "#{path.src.tasks}/json/config.json"
	}






	grunt.task.registerTask 'default', '', () ->
		done = this.async()

		grunt.log.writeln()
		inquirer.prompt [
			name:    'task'
			message: 'What can I do for you today ?'
			type:    'list'
			choices: [
				{ name:'Build a custom flavour', value:'custom_flavour' }
			]
		], (data) -> grunt.task.run data.task; done()

