#-------------------------------------
#-- Run
#-------------------------------------
'use strict'
helper = require '../helpers/cli'


#-- PUBLIC
module.exports =

	#-- Run
	run: (context) ->
		task = if context.target? then context.target else 'default'
		helper.run task, context
