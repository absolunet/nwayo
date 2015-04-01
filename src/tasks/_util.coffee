util = {}


#-- sep
sep = require('path').sep
util.sep = (path) -> path.replace /\//g, sep


#-- paths
util.path = ( ->

	dir = {}
	dir.root           = '.'
	dir.cache          = util.sep "#{dir.root}/.nwayo-cache"
	dir.cache_inline   = util.sep "#{dir.cache}/inline-images"
	dir.cache_sass     = util.sep "#{dir.cache}/sass"
	dir.build          = util.sep "#{dir.root}/build"
	dir.build_assets   = util.sep "#{dir.build}/{fonts,images,raw}"
	dir.build_fonts    = util.sep "#{dir.build}/fonts"
	dir.build_icons    = util.sep "#{dir.build}/icons"
	dir.build_images   = util.sep "#{dir.build}/images"
	dir.build_raw      = util.sep "#{dir.build}/raw"
	dir.build_scripts  = util.sep "#{dir.build}/scripts"
	dir.build_styles   = util.sep "#{dir.build}/styles"
	dir.bundles        = util.sep "#{dir.root}/bundles"
	dir.components     = util.sep "#{dir.root}/components"
	dir.assets         = util.sep "#{dir.components}/**/assets"
	dir.fonts          = util.sep "#{dir.assets}/fonts"
	dir.icons          = util.sep "#{dir.assets}/icons"
	dir.images         = util.sep "#{dir.assets}/images"
	dir.inline         = util.sep "#{dir.assets}/inline-images"
	dir.raw            = util.sep "#{dir.assets}/raw"
	dir.scripts        = util.sep "#{dir.components}/**/scripts"
	dir.scripts_nolint = util.sep "#{dir.components}/{theme,vendor}-*/scripts"
	dir.styles         = util.sep "#{dir.components}/**/styles"
	dir.styles_nolint  = util.sep "#{dir.components}/{theme,vendor}-*/styles"
	dir.templates      = util.sep "#{dir.components}/**/templates"
	dir.bower          = util.sep "#{dir.root}/bower_components"
	dir.misc           = util.sep "#{dir.root}/misc"
	dir.resources      = util.sep "#{dir.misc}/resources"
	dir.stubs          = util.sep "#{dir.misc}/stubs"

	files = {}
	files.bundles_scripts = util.sep "#{dir.bundles}/**/*.js"
	files.bundles_styles  = util.sep "#{dir.bundles}/**/*.scss"
	files.fonts           = util.sep "#{dir.fonts}/**/*.{eot,svg,ttf,woff,woff2}"
	files.icons_favicon   = util.sep "#{dir.icons}/favicon.png"
	files.icons_icon      = util.sep "#{dir.icons}/icon.png"
	files.icons_large     = util.sep "#{dir.icons}/large.png"
	files.icons_tile      = util.sep "#{dir.icons}/tile.png"
	files.images          = util.sep "#{dir.images}/**/*.{gif,jpg,png,svg}"
	files.images2x        = util.sep "#{dir.images}/**/*\@2x.{gif,jpg,png,svg}"
	files.inline          = util.sep "#{dir.inline}/**/*.{gif,jpg,png,svg}"
	files.raw             = util.sep "#{dir.raw}/**/*"
	files.scripts         = util.sep "#{dir.scripts}/**/*.js"
	files.scripts_lint    = [files.bundles_scripts, files.scripts, util.sep "!#{dir.scripts_nolint}/**/*"]
	files.styles          = util.sep "#{dir.styles}/**/*.scss"
	files.styles_lint     = [files.bundles_styles, files.styles, util.sep "!#{dir.styles_nolint}/**/*"]
	files.templates       = util.sep "#{dir.templates}/**/*.jshtml"
	files.bower_scripts   = util.sep "#{dir.bower}/**/*.js"
	files.bower_styles    = util.sep "#{dir.bower}/**/*.{css,less,scss}"

	config = {}
	config.scsslint = util.sep "#{dir.root}/.scss-lint.yml"


	return {
		dir:    dir
		files:  files
		config: config
	}
)()

#-- package data
util.pkg = require "#{__dirname}/../package"



#-- create a vinyl stream from a text
util.vinyl_stream = (filename, string) ->
	vinyl = require 'vinyl'
	src   = require('stream').Readable { objectMode: true }

	src._read = () ->
		this.push new vinyl {
			path: filename
			contents: new Buffer(string)
		}
		this.push(null)

	return src




#-- constants
util.konstan = (type) ->
	parse_item = (item) -> "data.konstan['#{item.split('.').join("']['")}']"

	data = konstan: util.pkg.nwayo.konstan
	options = data.konstan.__options[type] or {}
	delete data.konstan.__options

	# path
	for source_key in ['build', 'build_fonts', 'build_icons', 'build_images', 'build_scripts', 'build_styles', 'build_raw', 'cache_inline', 'stubs']
		target_key = source_key.split('_').pop()
		data.konstan.path[target_key] = (if source_key isnt 'cache_inline' then data.konstan.path.root else '') + util.path.dir[source_key].substr(util.path.dir.root.length + 1) + '/'
		options.escape.push "path.#{target_key}" if options.escape and options.escape.indexOf 'path.root' isnt -1

	delete data.konstan.path.inline if type is 'scripts'

	# option escape strings
	if options.escape
		for item in options.escape
			item = parse_item item
			eval "#{item} = \"'\"+#{item}.replace(\"'\",\"\\\\\'\")+\"'\""

	# option excluse items
	if options.exclude
		for item in options.exclude
			item = parse_item item
			eval "delete #{item}"

	return data



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
	path = util.sep "#{elements[3]}/#{elements[1]}/#{elements.slice(4).join '/'}"
	return path



module.exports = util
