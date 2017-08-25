#-------------------------------------
#-- Grow
#-------------------------------------
'use strict'
helper = require '../helpers/cli'


#-- Get remote tags
getTags = ->
	es     = require 'execSync'
	result = es.exec 'git ls-remote --tags http://git.drupal.org/project/zurb-foundation.git'

	tags = []
	for tag in result.stdout.split '\n'
		if tag and not /\^\{\}$/.test tag
			tags.push tag.split('refs\/tags\/')[1]

	return tags.reverse().slice 0, 5



#-- PUBLIC
module.exports =

	#-- Run
	run: (context) ->
		helper.echo 'Soon...\n'
		return

		inquirer = require 'inquirer'

		helper.echo ''
		inquirer.prompt [
			{
				name:    'cms'
				message: 'Which cms:'
				type:    'list'
				choices: [
					{ name:'None',      value:'none' }
					{ name:'Drupal',    value:'drupal' }
					{ name:'Magento',   value:'magento' }
					{ name:'Sitecore',  value:'sitecore' }
					{ name:'Wordpress', value:'wordpress' }
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
				name:    'foundation_drupal_version'
				message: 'Which drupal foundation version:'
				type:    'list'
				choices: getTags
				when:    (data) -> (data.layout is 'foundation' and data.cms is 'drupal')
			}
			{
				name:     'name'
				message:  'Project slug name:'
				type:     'input'
				validate: (answer) -> if /^[a-z0-9\-]+$/.test(answer) then true else 'Alphanumeric and hyphen only'
			}
			{
				name:    'title'
				message: 'Project readable name:'
				type:    'input'
				validate: (answer) -> if /\S+/.test(answer) then true else 'Mandatory'
			}
		], (data) ->
			data.theme  = data.theme or false
			data.layout = data.layout or 'desktop'

			data.foundation = (data.layout is 'foundation')
			data.foundation_drupal = (data.layout is 'foundation' and data.cms is 'drupal')

			console.log data
