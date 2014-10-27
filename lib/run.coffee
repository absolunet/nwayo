# nwayo run [<task>]

module.exports = (app) ->

	app.run if app.target? then app.target else 'default'
