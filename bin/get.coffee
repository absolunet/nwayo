# nwayo get <component>

module.exports = (app) ->
	echo = console.log

	if app.projconf
		
		if app.target?
			
			echo 'getting '+app.target
		
		else app.usage()
	
	else app.noproject()