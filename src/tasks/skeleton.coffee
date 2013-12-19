module.exports = (grunt) ->
	path = grunt.config.get 'internal.path'
	util = grunt.config.get 'util'

	skeleton = path.skeleton.root
	out      = path.skeleton.base
	src      = path.src.nwayo


	grunt.task.registerTask 'skeleton', '', () ->

		# clean
		util.delete skeleton

		# build tree
		grunt.file.write out+'/'+dir+'/.gitignore', '' for dir in [
			'builds'
			'stubs'
			'sources/assets/data-uri'
			'sources/assets/fonts'
			'sources/assets/images'
			'sources/assets/images/vendor'
			'sources/css/vendor'
			'sources/js/vendor'
			'sources/tmpl/'
		]

		# copy items into place
		util.copy src+'/css/',      out+'/sources/css/'
		util.copy src+'/js/',       out+'/sources/js/'
		util.copy src+'/misc/',     out+'/sources/misc/'
		util.copy src+'/icons/',    out+'/sources/assets/icons/'
		util.copy src+'/examples/', out+'/__examples/'
		
		grunt.file.copy src+'/tmpl/gitignore.tmpl', out+'/sources/.gitignore'

