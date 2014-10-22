# nwayo run [<task>]

module.exports = (app) ->

	if app.projconf
	
		app.run if app.target? then app.target else 'default'
	
	else app.noproject()
