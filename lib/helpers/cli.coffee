#-------------------------------------
#-- CLI helpers
#-------------------------------------
'use strict'


#-- PUBLIC
module.exports =
	pkg: require '../../package'


	#-- Echo
	echo: console.log


	#-- Error
	error: (msg) ->
		chalk = require 'chalk'

		@echo chalk.red "\n #{msg}" if msg
		process.exit(1) if process



	#-- Usage
	usage: ->
		chalk = require 'chalk'
		path  = require 'path'

		@echo [
			'\n'
			'Usage: ' + chalk.yellow 'nwayo' + chalk.cyan ' <command>'
			''
			chalk.underline 'Project commands'
			chalk.yellow('nwayo get') + ' [' + chalk.cyan('<component>') + ']   install a nwayo component'
			chalk.yellow('nwayo run') + ' [' + chalk.cyan('<task>') + ']        run a task'
			chalk.yellow('nwayo rebuild') + '             run rebuild task'
			chalk.yellow('nwayo watch') + '               run watch task'
			chalk.yellow('nwayo doctor') + '              diagnose project dependencies'
			''
			chalk.underline 'Global commands'
			chalk.yellow('nwayo version') + '             get cli version'
			chalk.yellow('nwayo grow') + '                grow a new project'
			chalk.yellow('nwayo pronounce') + '           how to pronounce'
			''
			"nwayo@#{@pkg.version} #{path.normalize "#{__dirname}../../.."}"
			''
		].join '\n '



	#-- Run
	run: (task, context) ->
		fs     = require 'fs'
		semver = require 'semver'

		tool = if semver.lt context.pkg.nwayo.version, '2.2.0' then 'grunt' else 'gulp'
		base = "#{context.cwd}/node_modules/#{tool}"

		if fs.existsSync "#{base}/package.json"
			bin = ''
			arg = [task]

			switch tool

				when 'gulp'
					pkg = require "#{base}/package"
					bin = "#{base}/#{pkg.bin.gulp}"

				when 'grunt'
					grunt_cli = "#{__dirname}/../../node_modules/grunt-cli"
					pkg = require "#{grunt_cli}/package"

					bin = "#{grunt_cli}/#{pkg.bin.grunt}"
					arg.push '--gruntfile', "#{context.cwd}/gruntfile.js"


			spawn = require('win-spawn')
			cmd = spawn "#{bin}", arg, { env:process.env, stdio:'inherit' }
			cmd.on 'close', (code) ->
				if code and code is not 65
					@echo code




		else @error 'Build tool not found. Please run `npm install`'
