# nwayo get [<component>]

module.exports = (app) ->
	gignore  = require 'gulp-ignore'
	download = require 'download'
	dlstatus = require 'download-status'
	request  = require 'request'
	fs       = require 'fs'
	chalk    = require 'chalk'
	echo     = console.log

	repo = 'absolunet/nwayo-components'

	get = (components, available) ->
		unavailable = []
		exist       = []

		# check for availability and if it isn't installed
		for component in components
			unavailable.push component if available.indexOf(component) is -1
			exist.push component if fs.existsSync "#{app.cwd}/components/#{component}"

		if unavailable.length then echo chalk.red "\n [Error] - Component(s) unavailable : #{unavailable}"
		if exist.length then echo chalk.red "\n [Error] - Component(s) already installed : #{exist}"


		# let the downloading begin
		if not unavailable.length and not exist.length

			components[i] = "#{component}/**" for i, component of components

			echo ''
			new download { extract: true, strip: 1, mode: '755' }
				.get "https://github.com/#{repo}/archive/master.zip"
				.pipe gignore.include components
				.use dlstatus()
				.dest "#{app.cwd}/components/"
				.run()







	if app.projconf

		# get component list from github
		request {
			url: "https://api.github.com/repos/#{repo}/contents/"
			json: true
			headers: { 'User-Agent': "nwayo/#{app.nwayopkg.version}" }
		}, (error, response, body) ->

			if not error and response.statusCode is 200

				# get all available components
				available = []
				available.push item.name for item in body when item.type is 'dir'

				if app.target?

					get app.targets, available

				else

					# ask for components
					inquirer = require 'inquirer'

					choices = []
					choices.push { name:component, value:component } for component in available

					echo ''
					inquirer.prompt [{
						name:    'components'
						message: 'Which components do you want to install?'
						type:    'checkbox'
						choices: choices
						validate: (data) -> if data.length then true else 'Please choose at least one component'
					}], (data) -> get data.components, available


			else echo chalk.red "\n [Error fetching component list] - #{error || body.message || body}"

	else app.noproject()
