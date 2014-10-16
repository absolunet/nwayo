sep = require('path').sep

module.exports =

	#-- paths
	path: () ->

		dir = {}
		dir.root           = '.'
		dir.cache          = "#{dir.root}/.nwayo-cache"
		dir.cache_inline   = "#{dir.cache}/inline-images"
		dir.cache_sass     = "#{dir.cache}/sass"
		dir.build          = "#{dir.root}/build"
		dir.build_assets   = "#{dir.build}/{fonts,images,raw}"
		dir.build_icons    = "#{dir.build}/icons"
		dir.build_images   = "#{dir.build}/images"
		dir.build_scripts  = "#{dir.build}/scripts"
		dir.build_styles   = "#{dir.build}/styles"
		dir.common         = "#{dir.root}/common"
		dir.components     = "#{dir.root}/components"
		dir.bundles        = "#{dir.common}/bundles"
		dir.sources        = "#{dir.root}/{common,components}"
		dir.assets         = "#{dir.sources}/**/assets"
		dir.fonts          = "#{dir.assets}/fonts"
		dir.icons          = "#{dir.assets}/icons"
		dir.images         = "#{dir.assets}/images"
		dir.inline         = "#{dir.assets}/inline-images"
		dir.raw            = "#{dir.assets}/raw"
		dir.scripts        = "#{dir.sources}/**/scripts"
		dir.scripts_nolint = "#{dir.sources}/{theme,vendor}-*/scripts"
		dir.styles         = "#{dir.sources}/**/styles"
		dir.styles_nolint  = "#{dir.sources}/{theme,vendor}-*/styles"
		dir.templates      = "#{dir.sources}/**/templates"
		dir.bower          = "#{dir.root}/bower_components"

		files = {}
		files.bundles_scripts = "#{dir.bundles}/**/*.js"
		files.bundles_styles  = "#{dir.bundles}/**/*.scss"
		files.fonts           = "#{dir.fonts}/**/*.{eot,svg,ttf,woff}"
		files.fonts_copy      = "#{dir.fonts}/**/*.{eot,svg,ttf}"
		files.icons_favicon   = "#{dir.icons}/favicon.png"
		files.icons_icon      = "#{dir.icons}/icon.png"
		files.icons_large     = "#{dir.icons}/large.png"
		files.icons_tile      = "#{dir.icons}/tile.png"
		files.images          = "#{dir.images}/**/*.{gif,jpg,png,svg}"
		files.images2x        = "#{dir.images}/**/*\@2x.{gif,jpg,png,svg}"
		files.inline          = "#{dir.inline}/**/*.{gif,jpg,png,svg}"
		files.raw             = "#{dir.raw}/**/*"
		files.scripts         = "#{dir.scripts}/**/*.js"
		files.scripts_lint    = [files.scripts, "!#{dir.scripts_nolint}/**/*"]
		files.styles          = "#{dir.styles}/**/*.scss"
		files.styles_lint     = [files.styles, "!#{dir.styles_nolint}/**/*"]
		files.bower_scripts   = "#{dir.bower}/**/*.js"
		files.bower_styles    = "#{dir.bower}/**/*.{css,less,scss}"

		config = {}
		config.scsslint = "#{dir.root}/.scss-lint.yml"


		return {
			dir:    dir
			files:  files
			config: config
		}


	#-- image optimization parameters
	imagemin_params: () -> {
		optimizationLevel: 7
		progressive: true
		interlaced:  true
		svgoPlugins: [
			removeViewBox: false
			#removeUselessStrokeAndFill: false
		]
	}


	#-- gm optimization
	gm_optimization: (gmfile, info) ->
		gmfile.noProfile().quality(95) if info.format is 'JPG'
		gmfile.dither(false).colors(256) if info.format is 'PNG' and info.depth is 8
		return gmfile


	#-- assets rename
	assets_rename: (path) ->
		elements = path.split sep
		elements.shift() if elements[0] is 'components'
		rest = elements.splice(3)
		path = elements[2] + sep + elements[0] + sep + (rest.join sep)
		return path
