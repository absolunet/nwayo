#-------------------------------------
#-- Rebuild
#-------------------------------------
'use strict'
helper = require '../helpers/cli'


#-- PUBLIC
module.exports =

	#-- Run
	run: (context) ->
		helper.run 'rebuild', context
