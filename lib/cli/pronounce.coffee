#-------------------------------------
#-- Pronounce
#-------------------------------------
'use strict'
helper = require '../helpers/cli'


#-- PUBLIC
module.exports =

	#-- Run
	run: (context) ->

		helper.echo '/nwajo/'

		if process.platform is 'darwin'

			spawn = require('child_process').spawn
			spawn 'say', ['nwaw','yo']
