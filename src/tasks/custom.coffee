module.exports = (grunt) ->
	inquirer = require 'inquirer'
	exec = require 'exec-sync'

	path = grunt.config.get 'internal.path'
	util = grunt.config.get 'util'

	skeleton         = path.skeleton.base
	foundation       = path.skeleton.foundation
	foundationdrupal = path.skeleton.foundation_drupal

	getTags = (url) ->
		result = exec 'git ls-remote --tags '+url

		tags = []
		for tag in result.split('\n')
			if not /\^\{\}$/.test(tag) 
				tags.push tag.split('refs\/tags\/')[1] 

		return tags.reverse().slice(0,10)



	# custom flavour
	grunt.task.registerTask 'custom_flavour', '', () ->
		done = this.async()

		foundation_versions        = getTags 'https://github.com/zurb/foundation.git'
		foundation_drupal_versions = getTags 'http://git.drupal.org/project/zurb-foundation.git'

		inquirer.prompt [
			{
				name:    'cms'
				message: 'Which cms:'
				type:    'list'
				choices: [
					{ name:'None',     value:'none' }
					{ name:'Drupal',   value:'drupal' }
					{ name:'Magento',  value:'magento' }
					{ name:'Sitecore', value:'sitecore' }
				]
			}
			{
				name:    'theme'
				message: 'Has theme:'
				type:    'confirm'
				when:    (data) -> (data.cms isnt 'none')
			}
			{
				name:    'layout'
				message: 'Which layout:'
				type:    'list'
				choices: [
					{ name:'Desktop',                 value:'desktop' }
					{ name:'Mobile',                  value:'mobile' }
					{ name:'Responsive',              value:'responsive' }
					{ name:'Responsive (Foundation)', value:'foundation' }
				]
				when: (data) -> (data.theme isnt true)
			}
			{
				name:    'foundation_version'
				message: 'Which foundation version:'
				type:    'list'
				choices: foundation_versions
				when:    (data) -> (data.layout is 'foundation')
			}
			{
				name:    'foundation_drupal_version'
				message: 'Which drupal foundation version:'
				type:    'list'
				choices: foundation_drupal_versions
				when:    (data) -> (data.layout is 'foundation' and data.cms is 'drupal')
			}
			{
				name:     'name'
				message:  'Project slug name:'
				type:     'input'
				validate: (answer) -> if /^[a-z0-9\-\_]+$/.test(answer) then true else 'Alphanumeric, hyphen or underscore only'
			}
			{
				name:    'title'
				message: 'Project readable name:'
				type:    'input'
				validate: (answer) -> if /\S+/.test(answer) then true else 'Mandatory'
			}
			{
				name:    'addthis'
				message: 'Addthis pubid:'
				type:    'input'
			}
			{
				name:    'ga'
				message: 'Google Analytics key:'
				type:    'input'
			}
			{
				name:    'domain'
				message: 'Public domain:'
				type:    'input'
			}
		], (data) ->
			data.theme  = if data.theme  then data.theme  else false
			data.layout = if data.layout then data.layout else 'desktop'
			
			data.foundation = (data.layout is 'foundation')
			data.foundation_drupal = (data.layout is 'foundation' and data.cms is 'drupal')
			
			grunt.config.set 'internal.flags', data

			grunt.task.run 'skeleton', 'get_vendor'#, 'build'
			done()
