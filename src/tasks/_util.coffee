colors = require 'colors'

echo = console.log
util = {}






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
	elements = path.split '/'
	path = "#{elements[3]}/#{elements[1]}/#{elements.slice(4).join '/'}"
	return path











#-- paths
util.path = ( ->

	nolint = '{theme,vendor}'

	pattern = {}
	pattern.anytree = '**'

	ext = {}
	ext.fonts     = '{eot,svg,ttf,woff,woff2}'
	ext.images    = '{gif,jpg,png,svg}'
	ext.scripts   = 'js'
	ext.styles    = 'scss'
	ext.templates = 'jshtml'

	dir = {}
	dir.root           = '.'
	dir.cache          = "#{dir.root}/.nwayo-cache"
	dir.cache_inline   = "#{dir.cache}/inline-images"
	dir.cache_sass     = "#{dir.cache}/sass"
	dir.bundles        = "#{dir.root}/bundles"
	dir.components     = "#{dir.root}/components"
	dir.assets         = "#{dir.components}/#{pattern.anytree}/assets"
	dir.fonts          = "#{dir.assets}/fonts"
	dir.icons          = "#{dir.assets}/icons"
	dir.images         = "#{dir.assets}/images"
	dir.inline         = "#{dir.assets}/inline-images"
	dir.raw            = "#{dir.assets}/raw"
	dir.scripts        = "#{dir.components}/#{pattern.anytree}/scripts"
	dir.scripts_nolint = "#{dir.components}/#{nolint}-*/scripts"
	dir.styles         = "#{dir.components}/#{pattern.anytree}/styles"
	dir.styles_nolint  = "#{dir.components}/#{nolint}-*/styles"
	dir.templates      = "#{dir.components}/#{pattern.anytree}/templates"
	dir.bower          = "#{dir.root}/bower_components"
	dir.misc           = "#{dir.root}/misc"
	dir.resources      = "#{dir.misc}/resources"
	dir.stubs          = "#{dir.misc}/stubs"

	files = {}
	files.bundles_scripts = "#{dir.bundles}/#{pattern.anytree}/*.#{ext.scripts}"
	files.bundles_styles  = "#{dir.bundles}/#{pattern.anytree}/*.#{ext.styles}"
	files.fonts           = "#{dir.fonts}/#{pattern.anytree}/*.#{ext.fonts}"
	files.icons_favicon   = "#{dir.icons}/favicon.png"
	files.icons_icon      = "#{dir.icons}/icon.png"
	files.icons_large     = "#{dir.icons}/large.png"
	files.icons_tile      = "#{dir.icons}/tile.png"
	files.images          = "#{dir.images}/#{pattern.anytree}/*.#{ext.images}"
	files.images2x        = "#{dir.images}/#{pattern.anytree}/*\@2x.#{ext.images}"
	files.inline          = "#{dir.inline}/#{pattern.anytree}/*.#{ext.images}"
	files.raw             = "#{dir.raw}/#{pattern.anytree}/*"
	files.scripts         = "#{dir.scripts}/#{pattern.anytree}/*.#{ext.scripts}"
	files.scripts_lint    = [files.bundles_scripts, files.scripts, "!#{dir.scripts_nolint}/#{pattern.anytree}/*", "!#{dir.scripts}/#{pattern.anytree}/?(_)#{nolint}*.#{ext.scripts}"]
	files.styles          = "#{dir.styles}/#{pattern.anytree}/*.#{ext.styles}"
	files.styles_lint     = [files.bundles_styles, files.styles, "!#{dir.styles_nolint}/#{pattern.anytree}/*", "!#{dir.styles}/#{pattern.anytree}/?(_)#{nolint}*.#{ext.styles}"]
	files.templates       = "#{dir.templates}/#{pattern.anytree}/*.#{ext.templates}"

	build = {}
	build.fonts   = 'fonts'
	build.icons   = 'icons'
	build.images  = 'images'
	build.raw     = 'raw'
	build.scripts = 'scripts'
	build.styles  = 'styles'

	config = {}
	config.konstan  = "#{dir.root}/konstan.yaml"
	config.package  = "#{dir.root}/package.json"
	config.scsslint = "#{dir.root}/.scss-lint.yml"


	return {
		pattern: pattern
		dir:     dir
		files:   files
		build:   build
		config:  config
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



#-- extract bundles components
util.bundlesComponents = ( ->
	_ = require 'lodash'
	return _.uniq( _.flatten( _.pluck(util.bundles, 'assets.components')))
)()



module.exports = util
