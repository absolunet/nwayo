colors = require 'colors'

sep  = require('path').sep
echo = console.log
util = {}



#-- sep
util.sep = (path) -> path.replace /\//g, sep



#-- read and parse a YAML file
util.readYAML = (file) ->
	fs   = require 'fs'
	yaml = require 'js-yaml'

	return yaml.safeLoad fs.readFileSync(file, 'utf8')



#-- create a vinyl stream from a text
util.vinyl_stream = (filename, string) ->
	vinyl = require 'vinyl'
	src   = require('stream').Readable { objectMode: true }

	src._read = ->
		this.push new vinyl {
			path: filename
			contents: new Buffer(string)
		}
		this.push(null)

	return src



#-- constants
util.parse_konstan = (type, root_url) ->
	extend = require 'extend'

	parse_item = (item) -> "data['#{item.split('.').join("']['")}']"

	options = extend true, {}, util.konstan.options[type]
	paths   = extend true, {}, util.path.build
	data    = extend true, {}, util.konstan.data


	# output url paths
	data.path = root: root_url

	if type is 'styles'
		options.escape = ['path.root']
		paths.inline = util.path.dir.cache_inline

	for key, value of paths
		data.path[key] = (if key isnt 'inline' then "#{data.path.root}/" else '') + value
		options.escape.push "path.#{key}" if options.escape and options.escape.indexOf 'path.root' isnt -1


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











#-- paths
util.path = ( ->

	nolint = '{theme,vendor}'

	ext = {}
	ext.fonts     = '{eot,svg,ttf,woff,woff2}'
	ext.images    = '{gif,jpg,png,svg}'
	ext.scripts   = 'js'
	ext.styles    = 'scss'
	ext.templates = 'jshtml'

	dir = {}
	dir.root           = '.'
	dir.cache          = util.sep "#{dir.root}/.nwayo-cache"
	dir.cache_inline   = util.sep "#{dir.cache}/inline-images"
	dir.cache_sass     = util.sep "#{dir.cache}/sass"
	dir.bundles        = util.sep "#{dir.root}/bundles"
	dir.components     = util.sep "#{dir.root}/components"
	dir.assets         = util.sep "#{dir.components}/**/assets"
	dir.fonts          = util.sep "#{dir.assets}/fonts"
	dir.icons          = util.sep "#{dir.assets}/icons"
	dir.images         = util.sep "#{dir.assets}/images"
	dir.inline         = util.sep "#{dir.assets}/inline-images"
	dir.raw            = util.sep "#{dir.assets}/raw"
	dir.scripts        = util.sep "#{dir.components}/**/scripts"
	dir.scripts_nolint = util.sep "#{dir.components}/#{nolint}-*/scripts"
	dir.styles         = util.sep "#{dir.components}/**/styles"
	dir.styles_nolint  = util.sep "#{dir.components}/#{nolint}-*/styles"
	dir.templates      = util.sep "#{dir.components}/**/templates"
	dir.bower          = util.sep "#{dir.root}/bower_components"
	dir.misc           = util.sep "#{dir.root}/misc"
	dir.resources      = util.sep "#{dir.misc}/resources"
	dir.stubs          = util.sep "#{dir.misc}/stubs"

	files = {}
	files.bundles_scripts = util.sep "#{dir.bundles}/**/*.#{ext.scripts}"
	files.bundles_styles  = util.sep "#{dir.bundles}/**/*.#{ext.styles}"
	files.fonts           = util.sep "#{dir.fonts}/**/*.#{ext.fonts}"
	files.icons_favicon   = util.sep "#{dir.icons}/favicon.png"
	files.icons_icon      = util.sep "#{dir.icons}/icon.png"
	files.icons_large     = util.sep "#{dir.icons}/large.png"
	files.icons_tile      = util.sep "#{dir.icons}/tile.png"
	files.images          = util.sep "#{dir.images}/**/*.#{ext.images}"
	files.images2x        = util.sep "#{dir.images}/**/*\@2x.#{ext.images}"
	files.inline          = util.sep "#{dir.inline}/**/*.#{ext.images}"
	files.raw             = util.sep "#{dir.raw}/**/*"
	files.scripts         = util.sep "#{dir.scripts}/**/*.#{ext.scripts}"
	files.scripts_lint    = [files.bundles_scripts, files.scripts, util.sep("!#{dir.scripts_nolint}/**/*"), util.sep("!#{dir.scripts}/**/?(_)#{nolint}*.#{ext.scripts}")]
	files.styles          = util.sep "#{dir.styles}/**/*.#{ext.styles}"
	files.styles_lint     = [files.bundles_styles, files.styles, util.sep("!#{dir.styles_nolint}/**/*"), util.sep("!#{dir.styles}/**/?(_)#{nolint}*.#{ext.styles}")]
	files.templates       = util.sep "#{dir.templates}/**/*.#{ext.templates}"

	build = {}
	build.fonts   = 'fonts'
	build.icons   = 'icons'
	build.images  = 'images'
	build.raw     = 'raw'
	build.scripts = 'scripts'
	build.styles  = 'styles'

	config = {}
	config.konstan  = util.sep "#{dir.root}/konstan.yaml"
	config.package  = util.sep "#{dir.root}/package.json"
	config.scsslint = util.sep "#{dir.root}/.scss-lint.yml"


	return {
		dir:    dir
		files:  files
		build:  build
		config: config
	}
)()



#-- package data
util.pkg     = require "#{__dirname}/../package"
util.konstan = util.readYAML util.path.config.konstan



#-- load bundles
util.bundles = ( ->
	glob     = require 'glob'
	minimist = require 'minimist'

	# get cli flag
	options = minimist process.argv.slice(2), { string: 'bundle', default: { bundle: '*' } }

	# get list
	bundles = glob.sync "#{util.path.dir.bundles}/#{options.bundle}.yaml"

	# process bundles
	if bundles.length
		data = {}
		for name in bundles
			name = name.match(/([^/]+).yaml/)[1]
			data[name] = util.readYAML "#{__dirname}/../bundles/#{name}.yaml"

	else
		echo "\n No bundle #{if options.bundle != '*' then "'"+options.bundle+"' " else ""}found".red
		process.exit(1) if process

	return data

)()





module.exports = util
