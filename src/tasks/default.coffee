#debug = require 'gulp-debug'
gulp = require 'gulp'
fs   = require 'fs'

util = require './_util'
path = util.path
pkg  = util.pkg
echo = console.log




#-- Rebuild
gulp.task 'rebuild', (cb) ->
	runsequence = require 'run-sequence'
	runsequence ['assets', 'icons', 'scripts', 'styles'], cb



#-- Rebuild scripts & styles
gulp.task 'rebuild-ss', (cb) ->
	runsequence = require 'run-sequence'
	runsequence ['scripts', 'styles'], cb



#-- Default menu
gulp.task 'default', (cb) ->
	colors      = require 'colors'
	runsequence = require 'run-sequence'
	inquirer    = require 'inquirer'

	echo '\n'
	echo " #{pkg.name} ".bgGreen.bold + "    [nwayo #{pkg.nwayo.version}]".yellow
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
			]
		}
	], (data) ->
		echo '\n\n'
		runsequence task, cb
