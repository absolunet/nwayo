#-------------------------------------
#-- Doctor
#-------------------------------------
'use strict'

helper = require '../helpers/cli'
fs     = require 'fs'
chalk  = require 'chalk'

context = null



#-- node
analyze_node = (callback) ->
	david = require 'david'

	data = outdated: []
	david.getUpdatedDependencies context.pkg, dev:true, (er, deps) ->

		if Object.keys(deps).length
			for name, version of deps
				if version.required isnt version.stable
					data.outdated.push {
						name:    name
						current: version.required
						latest:  version.stable
					}

		callback null, data



#-- bower
analyze_bower = (callback) ->

	if fs.existsSync "#{context.cwd}/bower.json"
		bower  = require 'bower'
		semver = require 'semver'

		isPreVersion = (v1, v2) -> ['premajor', 'preminor', 'prepatch', 'prerelease'].includes semver.diff v1, v2

		data = outdated: []
		bower.commands.list().on 'end', (deps) ->

			for name, info of deps.dependencies
				stable = false

				if info.pkgMeta

					# if there is an update
					if info.update and info.pkgMeta.version isnt info.update.latest

						# if the update is pre-version
						if isPreVersion info.update.latest, info.pkgMeta.version

							# search all versions
							for version in info.versions

								# if not a pre-version
								if not isPreVersion version, info.pkgMeta.version

									# if newer than current version
									if semver.gt version, info.pkgMeta.version
										stable = version

									# stop looping since in desc order
									else
										break

						# if update is a stable version
						else
							stable = info.update.latest

						# if a stable newer version was found
						if stable
							data.outdated.push {
								name:    name
								current: info.pkgMeta.version
								latest:  stable
							}
				else
					data.outdated.push {
						name:    name
						message: 'Not installed'
					}

			callback null, data

	else callback null, error: 'No bower.json file found'



#-- cli
analyze_cli = (callback) ->
	david = require 'david'

	data = outdated: {}
	david.getUpdatedDependencies dependencies: {nwayo: helper.pkg.version}, (er, deps) ->
		semver = require 'semver'

		if Object.keys(deps).length
			if semver.lt deps.nwayo.required, deps.nwayo.stable
				data.outdated =
					current: deps.nwayo.required
					latest:  deps.nwayo.stable

		callback null, data



#-- report
report = (title, data) ->
	reward = false
	helper.echo "  #{chalk.yellow title} diagnosis"

	if data.error
		helper.echo chalk.red "    #{data.error}"

	else if title is 'CLI' and Object.keys(data.outdated).length and not /(alpha|beta)/.test(data.outdated.current)
		helper.echo chalk.red '    You are a dull blade   ಠ_ಠ'
		helper.echo ''
		helper.echo "    #{chalk.red data.outdated.current} ➝  #{chalk.green data.outdated.latest}"

	else if data.outdated.length
		helper.echo chalk.red '    You are a dull blade   ಠ_ಠ'
		helper.echo ''

		for item in data.outdated
			msg = if item.message then "#{chalk.red item.message}" else "#{chalk.red item.current} ➝  #{chalk.green item.latest}"
			helper.echo "    [#{item.name}] : #{msg}"

	else
		helper.echo chalk.green '    You are cutting edge   (^_^)'
		reward = true

	helper.echo '\n'

	return reward



#-- PUBLIC
module.exports =

	#-- Run
	run: (context_param) ->
		async   = require 'async'
		spinner = require('cli-spinner').Spinner

		context = context_param

		helper.echo ''
		spin = new spinner "Diagnosing #{chalk.cyan context.pkg.name}... %s"
		spin.start()

		async.parallel
			node: analyze_node
			bower: analyze_bower
			cli: analyze_cli
		, (error, data) ->

			spin.stop()
			helper.echo '\n'

			node_reward = report 'Node', data.node
			bower_reward = report 'Bower', data.bower
			cli_reward = report 'CLI', data.cli

			# reward
			if node_reward and bower_reward and cli_reward
				helper.echo fs.readFileSync "#{__dirname}/../text/reward.txt", 'utf8'
				helper.echo ''

