#-------------------------------------
#-- Version
#-------------------------------------
'use strict'
helper = require '../helpers/cli'


#-- PUBLIC
module.exports =

	#-- Run
	run: -> helper.echo helper.pkg.version
