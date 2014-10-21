'use strict';

# process
process.title = 'nwayo';

# modules
fs       = require 'fs'
colors   = require 'colors'
minimist = require 'minimist'

# configs
app            = {}
app.configfile = '.nwayorc'
app.cwd        = process.cwd()
app.projpkg    = require "#{app.cwd}/package"
app.nwayopkg   = require '../package'
app.projconf   = JSON.parse fs.readFileSync("#{app.cwd}/#{app.configfile}") if fs.existsSync "#{app.cwd}/#{app.configfile}"

# arguments
argv        = minimist process.argv.slice 2
app.command = argv._[0]
app.target  = argv._[1]

# functions
echo = console.log

app.usage = -> 
	path = require 'path'
	
	echo [
		'\n'
		'Usage: ' + 'nwayo'.yellow + ' <command>'.cyan
		''
		'Project commands'.underline
		'nwayo analyze'.yellow + ' <name>'.cyan + '   analyze node|bower dependencies'
		'nwayo get'.yellow + ' <component>'.cyan + '  install a nwayo component'
		'nwayo run'.yellow + ' <task>'.cyan + '       run a task'
		'nwayo watch'.yellow + '            run watch task'
		''
		'Global commands'.underline
		'nwayo version'.yellow + '          get cli version'
		'nwayo grow'.yellow + '             grow a new project'
		''
		"nwayo@#{app.nwayopkg.version} #{path.dirname __dirname}"
		''
	].join '\n '


app.noproject = -> 
	echo "\n No #{app.configfile} file found".red


app.run = (task) ->
	base    = "#{app.cwd}/node_modules/gulp"
	spawn   = require('child_process').spawn
	gulppkg = require "#{base}/package"

	cmd = spawn "#{base}/#{app.gulppkg.bin.gulp}", [task], { env:process.env, stdio:'inherit' }

	cmd.on 'close', (code) ->
		if code and code is not 65
			echo code


# run command
#path = require 'path'
#
#console.log path.normalize "./#{app.command}.coffee"
#
#if fs.existsSync "#{app.command}.coffee"
#	require("./#{app.command}") app
#else
#	echo ':('



	

#	# nwayo run <task>
#	when 'run'
#		if projconf
#			if target? then run target else usage()
#		else noproject()
#
#
#
#	# nwayo watch
#	when 'watch'
#		if projconf
#			run 'watch'
#		else noproject()
#
#
#
#
#
#
#	# nwayo version
#	when 'version'
#		if target? then echo nwayopkg.version else usage()
#
#
#
#	# nwayo grow
#	when 'grow'
#		if target?
#			echo 'growing'
#			#grunt = require 'grunt'
#			#grunt.file.setBase "#{__dirname}/.."
#			#grunt.config.set 'cwd', cwd
#			#grunt.tasks ['default']
#		
#		else usage()
#
#
#	# nwayo
#	when 'grow'
#
#	# nwayo <fubar>
#	else usage()
#