module.exports = (grunt) ->
	request = require 'request'
	async   = require 'async'
	AdmZip  = require 'adm-zip'

	path = grunt.config.get 'internal.path'
	util = grunt.config.get 'util'

	skeleton         = path.skeleton.base
	foundation       = path.skeleton.foundation
	foundationdrupal = path.skeleton.foundation_drupal
	vendor           = path.skeleton.tmp_vendor



	# get vendor
	grunt.task.registerTask 'get_vendor', '', () ->
		done = this.async()

		flags = grunt.config.get 'internal.flags'

		files = [
			{ dest:skeleton+'/sources/css/libs/elements.less',        src:'https://raw.github.com/dmitryf/elements/master/elements.less' }
			{ dest:skeleton+'/sources/css/libs/html5boilerplate.css', src:'https://raw.github.com/h5bp/html5-boilerplate/master/css/main.css' }
			{ dest:skeleton+'/sources/css/libs/normalize.css',        src:'https://raw.github.com/necolas/normalize.css/master/normalize.css' }
			{ dest:skeleton+'/sources/css/libs/reset.css',            src:'http://meyerweb.com/eric/tools/css/reset/reset.css' }
		#	{ dest:vendor+'/kafe.zip',                                src:'http://localhost/kafe.zip' }
		]

		files.push { dest:vendor+'/foundation.zip',        src:'https://github.com/zurb/foundation/archive/'+flags.foundation_version+'.zip' } if flags.foundation
		files.push { dest:vendor+'/foundation-drupal.zip', src:'http://ftp.drupal.org/files/projects/zurb-foundation-'+flags.foundation_drupal_version+'.zip' } if flags.foundation_drupal

		async.mapLimit files, 10,
			(item, callback) ->
				options = url: item.src
				options.encoding = null if /\.zip$/.test(options.url)

				request options, (error, response, body) ->
					if not error and response.statusCode is 200
						grunt.file.write item.dest, body
						callback null, item
					else
						callback error

			(error, results) ->
				if error 
					grunt.log.error error
					done false
				else

					grunt.log.ok 'Downloaded ' + results.length.toString().cyan + ' files.'

					# kafe
					#new AdmZip(vendor+'/kafe.zip').extractAllTo(vendor+'/kafe/')
					#util.copy vendor+'/kafe/kafe-master', skeleton+'/sources/libs/'
					
					#grunt.log.ok 'Deployed kafe files.'


					# foundation
					if flags.foundation

						# duplicate skeleton
						util.copy skeleton+'/', foundation+'/', ['**', '**/.gitignore']
						new AdmZip(vendor+'/foundation.zip').extractAllTo(vendor+'/foundation/')
						fdnSrc = vendor+'/foundation/foundation-'+flags.foundation_version.substring(1)

						# copy
						util.copy fdnSrc+'/scss/',          foundation+'/sources/css/vendor/foundation/'
						util.copy fdnSrc+'/js/foundation/', foundation+'/sources/js/vendor/foundation/'

						# changes
						fileList = "@import 'js/vendor/foundation/foundation'\n"
						for file in grunt.file.expand { cwd:foundation+'/sources/js/vendor/foundation/', filter:'isFile' }, '*.js'
							if file isnt 'foundation.js'
								fileList += "@import 'js/vendor/foundation/"+file.substring(0,file.length-3)+"'\n"
						grunt.file.write foundation+'/sources/js/foundation.js', fileList

						# cleanup
						util.delete foundation+'/sources/css/vendor/.gitignore'
						util.delete foundation+'/sources/js/vendor/.gitignore'

						grunt.log.ok 'Deployed foundation files.'





						# foundation drupal
						if flags.foundation_drupal

							# duplicate skeleton
							util.copy foundation+'/', foundationdrupal+'/', ['**', '**/.gitignore']
							new AdmZip(vendor+'/foundation-drupal.zip').extractAllTo(vendor+'/foundation-drupal/')
							fdnSrc = vendor+'/foundation-drupal/zurb-foundation/STARTER'

							# copy 
							util.copy vendor+'/foundation-drupal/zurb-foundation/', foundationdrupal+'/__DRUPAL-THEME__zurb-foundation/'
							util.copy fdnSrc+'/images/foundation/', foundationdrupal+'/sources/assets/images/vendor/foundation/'
							util.copy fdnSrc+'/templates/',         foundationdrupal+'/templates/'
							grunt.file.copy fdnSrc+'/scss/base/_drupal.scss', foundationdrupal+'/sources/css/vendor/foundation/base/_drupal.scss'

							# copy and change
							grunt.file.write foundationdrupal+'/sources/css/vendor/foundation/foundation.scss',
								grunt.file.read(foundationdrupal+'/sources/css/vendor/foundation/foundation.scss')+'\n@import "base/drupal";'

							grunt.file.write foundationdrupal+'/STARTER.info',
								grunt.file.read(fdnSrc+'/STARTER.info.txt')
									.replace(/\nstylesheets\[/g,                 '\n;stylesheets[')
									.replace(/\nscripts\[/g,                     '\n;scripts[')
									.replace('base theme = zurb_foundation', 'base theme = zurb_foundation\n\nstylesheets[all][] = builds/css/core.css\nscripts[] = builds/js/core.js')																

							# cleanup
							util.delete foundationdrupal+'/sources/assets/images/.gitignore'
							util.delete foundationdrupal+'/sources/assets/images/vendor/.gitignore'



							grunt.log.ok 'Deployed drupal foundation files.'
					

					util.delete vendor

					done()

