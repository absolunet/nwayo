#-------------------------------------
#-- Get
#-------------------------------------
'use strict'
helper = require '../helpers/cli'


#-- Constants
REPO = 'absolunet/nwayo-components'


#-- Get
get = (context, available) ->
	fs       = require 'fs'
	download = require 'download'
	dlstatus = require 'download-status'
	gignore  = require 'gulp-ignore'

	components  = context.targets
	unavailable = []
	exist       = []

	# check for availability and if it isn't installed
	for component in components
		unavailable.push component if available.indexOf(component) is -1
		exist.push component if fs.existsSync "#{context.cwd}/components/#{component}"

	if unavailable.length then helper.error "[Error] - Component(s) unavailable : #{unavailable}"
	if exist.length then helper.error "[Error] - Component(s) already installed : #{exist}"


	# let the downloading begin
	if not unavailable.length and not exist.length

		components[i] = "#{component}/**" for i, component of components

		helper.echo ''
		new download { extract: true, strip: 1, mode: '755' }
			.get "https://github.com/#{REPO}/archive/master.zip"
			.pipe gignore.include components
			.use dlstatus()
			.dest "#{context.cwd}/components/"
			.run()



#-- PUBLIC
module.exports =

	#-- Run
	run: (context) ->
		request = require 'request'

		# get component list from github
		request {
			url: "https://api.github.com/repos/#{REPO}/contents/"
			json: true
			headers: { 'User-Agent': "nwayo/#{helper.pkg.version}" }
		}, (error, response, body) ->


			if not error and response.statusCode is 200

				# get all available components
				available = []
				available.push item.name for item in body when item.type is 'dir'

				# if selected components
				if context.target?
					get context, available


				# ask for components
				else
					inquirer = require 'inquirer'

					choices = []
					choices.push { name:component, value:component } for component in available

					helper.echo ''
					inquirer.prompt [{
						name:    'components'
						message: 'Which components do you want to install?'
						type:    'checkbox'
						choices: choices
						validate: (data) -> if data.length then true else 'Please choose at least one component'
					}], (data) ->
						context.targets = data.components
						get context, available


			else helper.error "[Error fetching component list] - #{error || body.message || body}"
