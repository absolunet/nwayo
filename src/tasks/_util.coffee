sep  = require('path').sep
util = {}


#-- paths
util.path = ( ->

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
	dir.bundles        = "#{dir.root}/bundles"
	dir.components     = "#{dir.root}/components"
	dir.assets         = "#{dir.components}/**/assets"
	dir.fonts          = "#{dir.assets}/fonts"
	dir.icons          = "#{dir.assets}/icons"
	dir.images         = "#{dir.assets}/images"
	dir.inline         = "#{dir.assets}/inline-images"
	dir.raw            = "#{dir.assets}/raw"
	dir.scripts        = "#{dir.components}/**/scripts"
	dir.scripts_nolint = "#{dir.components}/{theme,vendor}-*/scripts"
	dir.styles         = "#{dir.components}/**/styles"
	dir.styles_nolint  = "#{dir.components}/{theme,vendor}-*/styles"
	dir.templates      = "#{dir.components}/**/templates"
	dir.bower          = "#{dir.root}/bower_components"

	files = {}
	files.bundles_scripts = "#{dir.bundles}/**/*.js"
	files.bundles_styles  = "#{dir.bundles}/**/*.scss"
	files.fonts           = "#{dir.fonts}/**/*.{eot,svg,ttf,woff,woff2}"
	files.icons_favicon   = "#{dir.icons}/favicon.png"
	files.icons_icon      = "#{dir.icons}/icon.png"
	files.icons_large     = "#{dir.icons}/large.png"
	files.icons_tile      = "#{dir.icons}/tile.png"
	files.images          = "#{dir.images}/**/*.{gif,jpg,png,svg}"
	files.images2x        = "#{dir.images}/**/*\@2x.{gif,jpg,png,svg}"
	files.inline          = "#{dir.inline}/**/*.{gif,jpg,png,svg}"
	files.raw             = "#{dir.raw}/**/*"
	files.scripts         = "#{dir.scripts}/**/*.js"
	files.scripts_lint    = [files.bundles_scripts, files.scripts, "!#{dir.scripts_nolint}/**/*"]
	files.styles          = "#{dir.styles}/**/*.scss"
	files.styles_lint     = [files.bundles_styles, files.styles, "!#{dir.styles_nolint}/**/*"]
	files.templates       = "#{dir.templates}/**/*.jshtml"
	files.bower_scripts   = "#{dir.bower}/**/*.js"
	files.bower_styles    = "#{dir.bower}/**/*.{css,less,scss}"

	config = {}
	config.scsslint = "#{dir.root}/.scss-lint.yml"


	return {
		dir:    dir
		files:  files
		config: config
	}
)()

#-- package data
util.pkg = require "#{__dirname}/../package"



#-- env tokens
util.token = ( ->
	data         = util.pkg.nwayo.token
	data.name    = util.pkg.name
	data.version = util.pkg.nwayo.version
	return data
)()

#-- token regexp
util.token_regexp = /ΦΦ(\w+)ΦΦ/g

#-- token replace
util.token_replace = (match,token) -> util.token[token]



#-- image optimization parameters
util.imagemin_params = -> {
	optimizationLevel: 7
	progressive: true
	interlaced:  true
	svgoPlugins: [
		removeViewBox: false
		#removeUselessStrokeAndFill: false
	]
}

#-- gm optimization
util.gm_optimization = (gmfile, info) ->
	gmfile.noProfile().quality(95) if info.format is 'JPG'
	gmfile.dither(false).colors(256) if info.format is 'PNG' and info.depth is 8
	return gmfile



#-- assets rename
util.assets_rename = (path) ->
	elements = path.split sep
	path = elements[3] + sep + elements[1] + sep + (elements.slice(4).join sep)
	return path



module.exports = util
