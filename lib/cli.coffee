'use strict'

module.exports =

	argv: (argv, cwd) ->

		# modules
		fs       = require 'fs'
		chalk    = require 'chalk'

		# configs
		app            = {}
		app.nwayopkg   = require '../package'
		app.cwd        = cwd or __dirname
		app.configfile = '.nwayokonfig'

		# arguments
		app.command = argv[0]
		app.target  = argv[1]
		app.targets = argv.slice 1


		# functions
		echo = console.log

		app.error = (msg) ->
			echo chalk.red "\n #{msg}" if msg
			process.exit(1) if process


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

			# if project command
			if ['analyze','get','run','watch'].indexOf(app.command) isnt -1

				# get project config file
				if fs.existsSync "#{app.cwd}/#{app.configfile}"
					app.projconf = JSON.parse fs.readFileSync("#{app.cwd}/#{app.configfile}")

					# get project package.json file
					if fs.existsSync "#{app.cwd}/package.json"
						app.projpkg = require "#{app.cwd}/package"

					else app.error 'No package.json file found'

				else app.error "No #{app.configfile} file found"

			require("./#{app.command}") app

		else
			app.usage()

