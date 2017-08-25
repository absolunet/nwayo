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
		context.flags = bundle: context.targets[1] if context.targets[1]

		helper.run task, context
