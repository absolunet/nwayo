module.exports = (grunt) ->
	_          = require 'lodash'
	fs         = require 'fs'
	preprocess = require 'preprocess'

	config = grunt.config.get 'internal.config'
	pkg    = grunt.config.get 'internal.pkg'
	path   = grunt.config.get 'internal.path'
	util   = grunt.config.get 'util'

	skeleton         = path.skeleton.base
	foundation       = path.skeleton.foundation
	foundationdrupal = path.skeleton.foundation_drupal




	# build
	grunt.task.registerTask 'build', '', () ->
		less = []

		flags = grunt.config.get('internal.flags')
		data  = _.merge {}, (if config[flags.cms] then config[flags.cms] else config.default), flags
		out   = path.out.dist+'/'+data.name+'_'+grunt.template.today('_yyyy.mm.dd-HH.MM.ss')

		data.root     += if data.theme then '/'+pkg.name else ''
		data.build     = data.root+'/builds'
		data.package   = pkg.name
		data.version   = pkg.version
		data.author    = pkg.author.name
		data.copyright = '\n\t<!-- '+pkg.name+' '+pkg.version+' (c) '+grunt.template.today('yyyy')+' '+pkg.author.name+' -->'

		data.ga      = if data.ga      then data.ga      else '{TODO}'
		data.addthis = if data.addthis then data.addthis else '{TODO}'
		data.domain  = if data.domain  then data.domain  else '{TODO}'

		data.css_common = ''


		# copy base
		if data.layout is 'foundation'
			if data.cms is 'drupal'
				src = path.skeleton.foundation_drupal
			else
				src = path.skeleton.foundation
		else
			src = path.skeleton.base

		util.copy src+'/', out+'/', ['**', '**/.gitignore']





		# theme
		if data.theme
			grunt.file.delete out+'/sources/css/libs/reset.css',
			grunt.file.delete out+'/sources/css/libs/normalize.css',
			grunt.file.delete out+'/sources/css/libs/html5boilerplate.css',
			grunt.file.delete out+'/sources/css/libs/nwayo-boilerplate.less'
		else
			less.push 'nwayo-boilerplate'


		# foundation
		if data.layout is 'foundation'
			grunt.file.delete out+'/sources/css/libs/reset.css',
			grunt.file.delete out+'/sources/css/libs/html5boilerplate.css',
			grunt.file.delete out+'/sources/css/libs/nwayo-boilerplate.less'


		# drupal
		if data.cms is 'drupal'
			less.push 'cms-drupal'

			if data.layout is 'foundation'
				less.push 'cms-drupal-zurbfoundation'
				fs.renameSync out+'/STARTER.info', out+'/'+data.name+'.info' 

			else
				grunt.file.delete out+'/sources/css/libs/cms-drupal-zurbfoundation.less'

		else
			grunt.file.delete out+'/sources/css/libs/cms-drupal.less'
			grunt.file.delete out+'/sources/css/libs/cms-drupal-zurbfoundation.less'


		# magento
		if data.cms is 'magento'
			less.push 'cms-magento'
		else
			grunt.file.delete out+'/sources/css/libs/cms-magento.less'


		# sitecore
		if data.cms is 'sitecore'
			less.push 'cms-sitecore'
		else
			grunt.file.delete out+'/sources/css/libs/cms-sitecore.less'


		# no cms
		if data.cms is ''
			grunt.file.delete out+'/sources/css/misc/editor.less'





		# build less loader
		data.less += "@import 'libs/"+file+"';\n" for file in less

		# process data var
		value = preprocess.preprocess(value,data) if (grunt.util.kindOf(value) is 'string') for value in data


		###
		preprocess files
		###
		

		console.log data




