# nwayo watch

module.exports = (app) ->

	if app.projconf

		app.run 'watch'

	else app.noproject()

