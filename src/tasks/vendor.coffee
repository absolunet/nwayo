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
			{ dest:vendor+'/kafe.zip',                                src:'http://localhost/kafe.zip' }
		]

		files.push { dest:vendor+'/foundation.zip',        src:'https://github.com/zurb/foundation/archive/master.zip' } if flags.foundation
		files.push { dest:vendor+'/foundation-drupal.zip', src:'http://ftp.drupal.org/files/projects/zurb-foundation-7.x-4.0-beta1.zip' } if flags.foundation_drupal

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
					new AdmZip(vendor+'/kafe.zip').extractAllTo(vendor+'/kafe/')
					util.copy vendor+'/kafe/kafe-master', skeleton+'/sources/libs/'
					
					grunt.log.ok 'Deployed kafe files.'

	
					# foundation
					if flags.foundation

						# duplicate skeleton
						util.copy skeleton+'/', foundation+'/', ['**', '**/.gitignore']

						new AdmZip(vendor+'/foundation.zip').extractAllTo(vendor+'/foundation/')
						util.copy vendor+'/foundation/foundation-master/scss/',          foundation+'/sources/css/vendor/foundation/'
						util.copy vendor+'/foundation/foundation-master/js/foundation/', foundation+'/sources/js/vendor/foundation/'

						grunt.file.delete foundation+'/sources/css/vendor/.gitignore'
						grunt.file.delete foundation+'/sources/js/vendor/.gitignore'

						grunt.log.ok 'Deployed foundation files.'



						# foundation drupal
						if flags.foundation_drupal

							# duplicate skeleton
							util.copy skeleton+'/', foundationdrupal+'/', ['**', '**/.gitignore']

							new AdmZip(vendor+'/foundation-drupal.zip').extractAllTo(vendor+'/foundation-drupal/')
							util.copy vendor+'/foundation-drupal/zurb-foundation/', foundationdrupal+'/TEMP/'

							grunt.log.ok 'Deployed drupal foundation files.'
					

					util.delete vendor

					done()

