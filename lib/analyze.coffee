# nwayo analyze [<name>]

module.exports = (app) ->
	echo = console.log


	analyze = (module) ->

		switch module

			# nwayo analyze node
			when 'node'
				david = require 'david'

				reportTitle 'node'

				data = outdated: []
				david.getUpdatedDependencies app.projpkg, dev:true, (er, deps) ->

					if Object.keys(deps).length
						for name, version of deps
							data.outdated.push {
								name:    name
								current: version.required
								latest:  version.stable
							}

					else
						data.reward = 'cat'

					report data


			# nwayo analyze bower
			when 'bower'
				bower = require 'bower'

				reportTitle 'bower'

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

			else app.usage()



	reportTitle = (type) ->
		chalk = require 'chalk'
		echo ''
		echo "   Analyzing #{chalk.cyan app.projpkg.name} #{type} dependencies"
		echo ''


	report = (data) ->
		chalk = require 'chalk'

		if data.outdated.length
			echo chalk.bgRed '                               '
			echo chalk.bgRed '  You are a dull blade   ಠ_ಠ   '
			echo chalk.bgRed '                               '
			echo ''

			for item in data.outdated
				msg = if item.message then "#{chalk.red item.message}" else "#{chalk.red item.current} ➝  #{chalk.green item.latest}"
				echo "[#{item.name}] : #{msg}"

			app.error

		else
			fs = require 'fs'
			echo chalk.green "   You are cutting edge - Have a #{data.reward}"
			echo fs.readFileSync "#{__dirname}/../doc/rewards/#{data.reward}.txt", 'utf8'
			echo ''







	# cli
	if app.target?
		analyze app.target
	else

		inquirer = require 'inquirer'

		echo ''
		inquirer.prompt [{
			name:    'system'
			message: 'What do you want to analyze?'
			type:    'list'
			choices: [
				{ name:'Node modules dependencies status', value:'node' }
				{ name:'Bower packages dependencies status', value:'bower' }
			]
		}], (data) -> analyze data.system

