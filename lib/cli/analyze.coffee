#-------------------------------------
#-- Analyze
#-------------------------------------
'use strict'
helper = require '../helpers/cli'


#-- Analyze
analyze = (context) ->

	switch context.target

		# nwayo analyze node
		when 'node'
			david = require 'david'

			reportTitle 'node', context.pkg.name

			data = outdated: []
			david.getUpdatedDependencies context.pkg, dev:true, (er, deps) ->

				if Object.keys(deps).length
					for name, version of deps
						if version.required is not version.stable
							data.outdated.push {
								name:    name
								current: version.required
								latest:  version.stable
							}

				if not data.outdated.length
					data.reward = 'cat'

				report data


		# nwayo analyze bower
		when 'bower'
			fs = require 'fs'

			if bowerExists context

				bower = require 'bower'

				reportTitle 'bower', context.pkg.name

				data = outdated: []
				bower.commands.list().on 'end', (deps) ->

					for name, info of deps.dependencies
						if info.pkgMeta
							if info.update and info.pkgMeta.version isnt info.update.latest
								data.outdated.push {
									name:    name
									current: info.pkgMeta.version
									latest:  info.update.latest
								}
						else
							data.outdated.push {
								name:    name
								message: 'Not installed'
							}


					if not data.outdated.length
						data.reward = 'bird'

					report data

			else helper.error 'No bower.json file found'

		else helper.usage()



#-- Report title
reportTitle = (type, name) ->
	chalk = require 'chalk'
	helper.echo ''
	helper.echo "   Analyzing #{chalk.cyan name} #{type} dependencies"
	helper.echo ''



#-- Full report
report = (data) ->
	chalk = require 'chalk'

	if data.outdated.length
		helper.echo chalk.bgRed '                               '
		helper.echo chalk.bgRed '  You are a dull blade   ಠ_ಠ   '
		helper.echo chalk.bgRed '                               '
		helper.echo ''

		for item in data.outdated
			msg = if item.message then "#{chalk.red item.message}" else "#{chalk.red item.current} ➝  #{chalk.green item.latest}"
			helper.echo "[#{item.name}] : #{msg}"

		helper.error

	else
		fs = require 'fs'
		helper.echo chalk.green "   You are cutting edge - Have a #{data.reward}"
		helper.echo fs.readFileSync "#{__dirname}/../text/reward-#{data.reward}.txt", 'utf8'
		helper.echo ''

#-- bowerExists
bowerExists = (context) ->
	fs = require 'fs'
	return fs.existsSync "#{context.cwd}/bower.json"


#-- PUBLIC
module.exports =

	#-- Run
	run: (context) ->
		if context.target?
			analyze context

		else
			inquirer = require 'inquirer'

			choices = [name:'Node modules dependencies status', value:'node']
			choices.push { name:'Bower packages dependencies status', value:'bower'} if bowerExists(context)

			helper.echo ''
			inquirer.prompt [{
				name:    'system'
				message: 'What do you want to analyze?'
				type:    'list'
				choices:  choices
			}], (data) ->
				context.target = data.system
				analyze context
