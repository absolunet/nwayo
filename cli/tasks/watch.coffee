#-------------------------------------
#-- Watch
#-------------------------------------
'use strict'
helper = require '../helpers/cli'


#-- PUBLIC
module.exports =

	#-- Run
	run: (context) ->
		context.flags = bundle: context.targets[0] if context.targets[0]

		helper.run 'watch', context
