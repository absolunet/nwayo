#-------------------------------------
#-- CLI helpers
#-------------------------------------
'use strict'


#-- PUBLIC
module.exports =
	pkg: require "#{__dirname}/../../package"


	#-- Echo
	echo: console.log


	#-- Error
	error: (msg) ->
		chalk = require 'chalk'

		@echo chalk.red "\n #{msg}" if msg
		process.exit(1) if process



	#-- Usage
	usage: (context) ->
		chalk = require 'chalk'
		path  = require 'path'

		@echo [
			'\n'
			'Usage: ' + chalk.yellow 'nwayo' + chalk.cyan ' <command>'
			''
			chalk.underline 'Project commands'
			chalk.yellow('nwayo run') + ' [' + chalk.cyan('<task>') + ' [' + chalk.cyan('<bundle>') + ']]  Run a task'
			chalk.yellow('nwayo rebuild') + ' [' + chalk.cyan('<bundle>') + ']       Run rebuild task'
			chalk.yellow('nwayo watch') + ' [' + chalk.cyan('<bundle>') + ']         Run watch task'
			chalk.yellow('nwayo doctor') + '                   Diagnose project dependencies'
			''
			chalk.underline 'Flag commands'
			chalk.yellow('nwayo --version') + '         Get cli version'
			chalk.yellow('nwayo --tasks') + '           Get cli tasks list'
			chalk.yellow('nwayo --projecttasks') + '    Get project tasks list'
			chalk.yellow('nwayo --projectbundles') + '  Get project bundles list'
			chalk.yellow('nwayo --completion') + '      Bash completion code'
			chalk.yellow('nwayo --pronounce') + '       How to pronounce'
			''
			"     cli#{chalk.yellow('@')}#{context.cli.version} #{context.cli.path}"
			"workflow#{chalk.yellow('@')}#{@pkg.version} #{path.normalize "#{__dirname}/../"}"
			''
		].join '\n '



	#-- Run
	run: (task, context) ->
		fs   = require 'fs'
		path = require 'path'

		base = path.dirname require.resolve "gulp"

		pkg = require "#{base}/package"
		bin = path.normalize "#{base}/#{pkg.bin.gulp}"

		arg = [task]
		arg.push '--cwd', context.cwd
		arg.push '--gulpfile', "#{context.cwd}/node_modules/@absolunet/nwayo-workflow/workflow/gulpfile.js"

		spawn = require('win-spawn')
		cmd = spawn "#{bin}", arg, { env:process.env, stdio:'inherit' }
		cmd.on 'close', (code) ->
			if code and code is not 65
				@echo code
