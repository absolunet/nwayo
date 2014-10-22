'use strict';

# process
process.title = 'nwayo';

# modules
fs       = require 'fs'
chalk    = require 'chalk'
minimist = require 'minimist'

# configs
app            = {}
app.configfile = '.nwayokonfig'
app.cwd        = process.cwd()
app.projpkg    = require "#{app.cwd}/package"
app.nwayopkg   = require '../package'
app.projconf   = JSON.parse fs.readFileSync("#{app.cwd}/#{app.configfile}") if fs.existsSync "#{app.cwd}/#{app.configfile}"

# arguments
argv        = minimist process.argv.slice 2
app.command = argv._[0]
app.target  = argv._[1]
app.targets = argv._.slice 1


# functions
echo = console.log

app.usage = ->
	path = require 'path'

	echo [
		'\n'
		'Usage: ' + chalk.yellow 'nwayo' + chalk.cyan ' <command>'
		''
		chalk.underline 'Project commands'
		chalk.yellow('nwayo analyze') + ' [' + chalk.cyan('<name>') + ']    analyze project dependencies'
		chalk.yellow('nwayo get') + ' [' + chalk.cyan('<component>') + ']   install a nwayo component'
		chalk.yellow('nwayo run') + ' [' + chalk.cyan('<task>') + ']        run a task'
		chalk.yellow('nwayo watch') + '               run watch task'
		''
		chalk.underline 'Global commands'
		chalk.yellow('nwayo version') + '             get cli version'
		chalk.yellow('nwayo grow') + '                grow a new project'
		''
		"nwayo@#{app.nwayopkg.version} #{path.dirname __dirname}"
		''
	].join '\n '


app.noproject = ->
	echo chalk.red "\n No #{app.configfile} file found"


app.run = (task) ->
	base    = "#{app.cwd}/node_modules/gulp"
	spawn   = require('child_process').spawn
	gulppkg = require "#{base}/package"

	cmd = spawn "#{base}/#{gulppkg.bin.gulp}", [task], { env:process.env, stdio:'inherit' }

	cmd.on 'close', (code) ->
		if code and code is not 65
			echo code





# run command
if app.command isnt 'cli' and fs.existsSync "#{__dirname}/#{app.command}.coffee"
	require("./#{app.command}") app
else
	app.usage()

