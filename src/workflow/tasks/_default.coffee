#debug = require 'gulp-debug'
gulp = require 'gulp'

echo = console.log
ENV  = global.nwayo.env




#-- Rebuild
gulp.task 'rebuild', (cb) ->
	runsequence = require 'run-sequence'
	runsequence ['assets', 'icons', 'scripts', 'styles', 'local'], cb



#-- Rebuild scripts & styles
gulp.task 'rebuild-ss', (cb) ->
	runsequence = require 'run-sequence'
	runsequence ['scripts', 'styles'], cb



#-- Default menu
gulp.task 'default', (cb) ->
	runsequence = require 'run-sequence'
	inquirer    = require 'inquirer'

	echo '\n'
	echo " #{ENV.pkg.name} ".bgGreen.bold + "    [nwayo #{ENV.pkg.nwayo.version}]".yellow
	echo ''

	inquirer.prompt [
		{
			name:    'task'
			message: 'Alo! Ki sa ou vle?'
			type:    'list'
			choices: [
				{ name:'Everything',       value:'rebuild' }
				{ name:'Scripts & styles', value:'rebuild-ss' }
				new inquirer.Separator()
				{ name:'Assets only',      value:'assets' }
				{ name:'Icons only',       value:'icons' }
				{ name:'Scripts only',     value:'scripts' }
				{ name:'Styles only',      value:'styles' }
				{ name:'Local only',       value:'local' }
			]
		}
	], (data) ->
		echo '\n\n'
		runsequence data.task, cb
