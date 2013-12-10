module.exports = (grunt) ->
	request = require 'request'
	async   = require 'async'
	AdmZip  = require 'adm-zip'

	path = grunt.config.get 'internal.path'
	util = grunt.config.get 'util'

	skeleton         = path.skeleton.base
	foundation       = path.skeleton.foundation
	foundationdrupal = path.skeleton.foundation_drupal


	# custom flavour
	grunt.task.registerTask 'custom_flavour', '', () ->
		grunt.config.set 'internal.flags.foundation', true
		grunt.config.set 'internal.flags.foundation_drupal', true

		grunt.task.run 'skeleton', 'get_vendor'#, 'build'
