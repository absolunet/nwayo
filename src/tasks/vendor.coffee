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
	grunt.task.registerTask 'vendor', '', () ->
		done = this.async()

		flags = grunt.config.get 'internal.flags'

		files = [
			{ dest:"#{skeleton}/sources/css/libs/elements.less",                    src:'https://raw.github.com/dmitryf/elements/master/elements.less' }
			{ dest:"#{skeleton}/sources/css/libs/html5boilerplate.css",             src:'https://raw.github.com/h5bp/html5-boilerplate/master/css/main.css' }
			{ dest:"#{skeleton}/sources/css/libs/normalize.css",                    src:'https://raw.github.com/necolas/normalize.css/master/normalize.css' }
			{ dest:"#{skeleton}/sources/css/libs/reset.css",                        src:'http://meyerweb.com/eric/tools/css/reset/reset.css' }
			{ dest:"#{skeleton}/sources/js/nwayo/vendor/jquery.js",                 src:'https://raw.githubusercontent.com/jquery/jquery/2.1.0/dist/jquery.min.js' }
			{ dest:"#{skeleton}/sources/js/nwayo/vendor/lo-dash.js",                src:'https://raw.githubusercontent.com/lodash/lodash/master/dist/lodash.compat.min.js' }
			{ dest:"#{skeleton}/sources/js/nwayo/vendor/underscore.string.js",      src:'https://raw.githubusercontent.com/epeli/underscore.string/master/dist/underscore.string.min.js' }
			{ dest:"#{skeleton}/sources/js/vendor/polyfill/html5shiv-printshiv.js", src:'https://raw.githubusercontent.com/aFarkas/html5shiv/master/src/html5shiv-printshiv.js' }
			{ dest:"#{skeleton}/sources/js/vendor/polyfill/nwmatcher.js",           src:'http://javascript.nwbox.com/NWMatcher/nwmatcher.js' }
			{ dest:"#{skeleton}/sources/js/vendor/polyfill/rem.js",                 src:'https://raw.githubusercontent.com/chuckcarpenter/REM-unit-polyfill/master/js/rem.js' }
			{ dest:"#{skeleton}/sources/js/vendor/polyfill/respond.js",             src:'https://raw.githubusercontent.com/scottjehl/Respond/master/dest/respond.src.js' }
			{ dest:"#{skeleton}/sources/js/vendor/polyfill/selectivizr.js",         src:'https://raw.githubusercontent.com/keithclark/selectivizr/master/selectivizr.js' }
			{ dest:"#{vendor}/kafe.zip",                                            src:'https://github.com/absolunet/kafe/archive/master.zip' }
		]

		files.push { dest:"#{vendor}/foundation.zip",        src:"https://github.com/zurb/foundation/archive/#{flags.foundation_version}.zip" } if flags.foundation
		files.push { dest:"#{vendor}/foundation-drupal.zip", src:"http://ftp.drupal.org/files/projects/zurb-foundation-#{flags.foundation_drupal_version}.zip" } if flags.foundation_drupal

		bar = util.progress 'Downloading', files.length

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

					bar.tick()


			(error, results) ->
				if error 
					grunt.log.error error
					done false
				else
					util.progress_done bar

					# kafe
					new AdmZip("#{vendor}/kafe.zip").extractAllTo("#{vendor}/kafe/")
					util.copy "#{vendor}/kafe/kafe-master/dist/", "#{skeleton}/sources/libs/"
					grunt.log.ok 'Deployed kafe files.'


					# foundation
					if flags.foundation

						# duplicate skeleton
						util.copy "#{skeleton}/", "#{foundation}/", ['**', '**/.gitignore']
						new AdmZip("#{vendor}/foundation.zip").extractAllTo("#{vendor}/foundation/")
						fdnSrc = "#{vendor}/foundation/foundation-#{flags.foundation_version.substring(1)}"

						# copy
						util.copy "#{fdnSrc}/scss/foundation/", "#{foundation}/sources/css/vendor/foundation/"
						util.copy "#{fdnSrc}/js/foundation/",   "#{foundation}/sources/js/vendor/foundation/"


						# changes
						fileList = "// @import 'js/vendor/foundation/foundation'\n"
						for file in grunt.file.expand { cwd:"#{foundation}/sources/js/vendor/foundation/", filter:'isFile' }, '*.js'
							if file isnt 'foundation.js'
								fileList += "// @import 'js/vendor/foundation/#{file.substring(0,file.length-3)}'\n"
						grunt.file.write "#{foundation}/sources/js/foundation.js", fileList

						grunt.file.write "#{foundation}/sources/css/_foundation-overwrites.scss", ''

						grunt.file.write "#{foundation}/sources/css/_foundation-settings.scss",
							grunt.file.read("#{fdnSrc}/scss/foundation/_settings.scss").replace(/"foundation\//g, '"vendor/foundation/')
				
						grunt.file.write "#{foundation}/sources/css/foundation.scss",
							'@import "foundation-settings";\n\n' +
							grunt.file.read("#{fdnSrc}/scss/foundation.scss").replace(/foundation\/components\//g, 'vendor/foundation/components/') +
							'\n\n@import "foundation-overwrites";\n'



						# cleanup
						util.delete "#{foundation}/sources/css/vendor/.gitignore"
						util.delete "#{foundation}/sources/js/vendor/.gitignore"

						grunt.log.ok 'Deployed foundation files.'





						# foundation drupal
						if flags.foundation_drupal

							# duplicate skeleton
							util.copy "#{foundation}/", "#{foundationdrupal}/", ['**', '**/.gitignore']
							new AdmZip("#{vendor}/foundation-drupal.zip").extractAllTo("#{vendor}/foundation-drupal/")
							fdnSrc = "#{vendor}/foundation-drupal/zurb-foundation/STARTER"

							# copy 
							util.copy "#{vendor}/foundation-drupal/zurb-foundation/", "#{foundationdrupal}/__DRUPAL-THEME__zurb-foundation/"
							util.copy "#{fdnSrc}/images/foundation/",                 "#{foundationdrupal}/sources/assets/images/vendor/foundation/"
							util.copy "#{fdnSrc}/templates/",                         "#{foundationdrupal}/templates/"

							# copy and change
							grunt.file.write "#{foundationdrupal}/template.php",
								grunt.file.read("#{fdnSrc}/template.php").replace(/STARTER/g, '/* @echo name */')

							grunt.file.write "#{foundationdrupal}/STARTER.info",
								grunt.file.read("#{fdnSrc}/STARTER.info.txt")
									.replace(/\nstylesheets\[/g,             '\n;stylesheets[')
									.replace(/\nscripts\[/g,                 '\n;scripts[')
									.replace('base theme = zurb_foundation', 'base theme = zurb_foundation\n\nstylesheets[all][] = builds/css/core.css\nscripts[] = builds/js/core.js')																

							# cleanup
							util.delete "#{foundationdrupal}/sources/assets/images/.gitignore"
							util.delete "#{foundationdrupal}/sources/assets/images/vendor/.gitignore"



							grunt.log.ok 'Deployed drupal foundation files.'
					

					util.delete vendor

					done()

