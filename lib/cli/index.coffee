#-------------------------------------
#-- CLI
#-------------------------------------
'use strict'
helper = require '../helpers/cli'


#-- PUBLIC
module.exports =

	#-- Arguments value
	argv: (argv, cwd) ->
		fs = require 'fs'

		# make echos trappable in tests
		helper.echo = console.log
		# --

		context =
			command: argv[0]
			target:  argv[1]
			targets: argv.slice 1
			cwd:     cwd or __dirname

		# run command
		if context.command isnt 'index' and fs.existsSync "#{__dirname}/#{context.command}.coffee"

			# if project command
			if ['doctor','get','rebuild','run','watch'].indexOf(context.command) isnt -1

				# get project package.json file
				if fs.existsSync "#{context.cwd}/package.json"
					context.pkg = require "#{context.cwd}/package"

					# check for nwayo config info
					if not context.pkg.nwayo then helper.error 'No nwayo config found'

				else helper.error 'No package.json file found'

			require("../cli/#{context.command}").run context

		else
			helper.usage()
