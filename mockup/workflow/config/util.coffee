module.exports = 

	#-- paths
	path: () ->
		
		dir = {}
		dir.root       = '../'
		dir.cache      = "#{dir.root}/.nwayo-cache"
		dir.build      = "#{dir.root}/build"
		dir.common     = "#{dir.root}/common"
		dir.components = "#{dir.root}/components"
		dir.bundles    = "#{dir.common}/bundles"
		dir.sources    = "#{dir.root}/{common,components}"
		dir.assets     = "#{dir.sources}/**/assets"
		dir.fonts      = "#{dir.assets}/fonts"
		dir.icons      = "#{dir.assets}/icons"
		dir.images     = "#{dir.assets}/images"
		dir.inline     = "#{dir.assets}/inline-images"
		dir.scripts    = "#{dir.sources}/**/scripts"
		dir.styles     = "#{dir.sources}/**/styles"
		dir.templates  = "#{dir.sources}/**/templates"

		files = {}
		files.bundles_scripts = "#{dir.bundles}/**/*.js"
		files.bundles_styles  = "#{dir.bundles}/**/*.scss"
		files.fonts           = "#{dir.fonts}/**/*.{eot,svg,ttf,woff}"
		files.fonts_copy      = "#{dir.fonts}/**/*.{eot,svg,ttf}"
		files.images          = "#{dir.images}/**/*.{gif,jpg,png,svg}"
		files.inline          = "#{dir.inline}/**/*.{gif,jpg,png,svg}"
		files.scripts         = "#{dir.scripts}/**/*.js"
		files.styles          = "#{dir.styles}/**/*.scss"

		config = {} 
		config.compass  = 'config/compass.rb'
		config.scsslint = 'config/scss-lint.yml'

		return {
			dir:    dir
			files:  files
			config: config
		}


	#-- image optimization parameters
	imagemin_params: () -> {
		optimizationLevel: 7
		progressive: false
		interlaced:  false
		svgoPlugins: [
			removeViewBox: false
			#removeUselessStrokeAndFill: false
		]
	}


	#-- assets rename
	assets_rename: (path) -> 
		elements = path.dirname.split '/'
		elements.shift() if elements[0] is 'components'
		rest = elements.splice(3)
		path.dirname = elements[2] + '/' + elements[0] + '/' + (rest.join '/')
		return