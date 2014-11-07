#-------------------------------------
#-- Pronounce
#-------------------------------------
'use strict'
helper = require '../helpers/cli'


#-- PUBLIC
module.exports =

	#-- Run
	run: (context) ->
		spawn = require('child_process').spawn

		spawn 'say', ['nwaw','yo']
