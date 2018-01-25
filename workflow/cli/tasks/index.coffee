#-------------------------------------
#-- CLI
#-------------------------------------
'use strict'
helper = require '../helpers/cli'


#-- PUBLIC
module.exports =

	#-- Arguments value
	argv: (argv, cwd, infos) ->
		path   = require 'path'
		fs     = require 'fs'
		slash  = require 'slash'
		semver = require 'semver'
		chalk  = require 'chalk'
		boxen  = require 'boxen'

		# make echos trappable in tests
		helper.echo = console.log
		# --

		context =
			command: argv[0] or ''
			target:  argv[1] or ''
			targets: argv.slice 1
			cwd:     slash cwd
			cli:     infos

		isFlag = context.command.substring(0,2) is '--'

		# run command
		if context.command isnt 'index' and ( isFlag or fs.existsSync "#{__dirname}/#{context.command}.coffee" )

			# if project command
			if ['doctor','get','rebuild','run','watch', '--projecttasks', '--projectbundles'].indexOf(context.command) isnt -1

				# get project package.json file
				if fs.existsSync "#{context.cwd}/package.json"
					context.pkg = require "#{context.cwd}/package"

					# check for asked version vs installed version
					requiredVersion  = context.pkg.dependencies['@absolunet/nwayo-workflow']
					installedVersion = helper.pkg.version

					if semver.gt requiredVersion, installedVersion
						helper.echo boxen(
							"nwayo workflow update #{chalk.dim(installedVersion)} #{chalk.reset('→')} #{chalk.green(requiredVersion)}\n\nThe required version in your project's package.json\nis greater than the installed one\n\nPlease update via #{chalk.yellow('npm install')}",
							{
								padding:     1,
								margin:      0.5,
								align:       'left',
								borderColor: 'yellow'
							}
						);
						helper.error()

				else helper.error 'No package.json file found'


			if isFlag

				if context.command is '--tasks'
					files = fs.readdirSync "#{__dirname}"
					tasks = []
					for file in files
						tasks.push file.substr(0, file.length-7) if file isnt 'index.coffee' and file.substring(0,5) isnt 'flag-'

					helper.echo tasks.join '\n'

				else if context.command is '--projecttasks'
					helper.run '--tasks-simple', context

				else if context.command is '--projectbundles'
					dirs = fs.readdirSync "#{context.cwd}/bundles/"
					helper.echo dirs.join '\n'

				else if context.command is '--pronounce'
					require("#{__dirname}/flag-#{context.command.substr(2)}").run context

				else
					helper.usage context


			else
				require("#{__dirname}/#{context.command}").run context


		else
			helper.usage context
