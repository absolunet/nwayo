#debug  = require 'gulp-debug'
gulp   = require 'gulp'
rename = require 'gulp-rename'
echo = console.log
PATH = global.nwayo.path
Util = global.nwayo.util


#"mkdirp":      "0.5.1",
#"gulp-gm":     "0.0.8",
#"imagemagick": "0.1.3",




# https://github.com/gleero/grunt-favicons
# https://github.com/audreyr/favicon-cheat-sheet


#-- favicon.ico
# https://mathiasbynens.be/notes/rel-shortcut-icon
gulp.task 'icons_favicon', ->
	mkdirp = require 'mkdirp'
	path   = require 'path'
	im     = require 'imagemagick'
	glob   = require 'glob'

	for file in (glob.sync PATH.files.icons_favicon, mark:true)
		out = path.dirname( "#{PATH.dir.build}/" + Util.assetsRename( file.substring( PATH.dir.root.length + 1 ) ) )
		mkdirp.sync out

		im.convert [
			file,
			'(', '-clone', '0', '-resize', '16x16', '-filter', 'box', ')'  # IE9 address bar, Pinned site Jump List/Toolbar/Overlay
			'(', '-clone', '0', '-resize', '24x24', '-filter', 'box', ')'  # IE9 Pinned site browser UI
			'(', '-clone', '0', '-resize', '32x32', '-filter', 'box', ')'  # New tab page in IE, taskbar button in Win 7+, Safari Read Later sidebar
			'(', '-clone', '0', '-resize', '48x48', '-filter', 'box', ')'  # Windows site icons
			'-delete', '0'
			"#{out}/favicon.ico"
		], (err, stdout) ->
			if err
				throw err
				echo stdout



#-- share icons
# https://mathiasbynens.be/notes/touch-icons
# https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/MobileHIG/IconMatrix.html
# https://developer.chrome.com/multidevice/android/installtohomescreen
# http://operacoast.com/developer
gulp.task 'icons_share', ( ->
	tasks = []

	for size in [
		 57   # For non-Retina (@1× display) iPhone, iPod Touch, and Android 2.1+ devices
		 72   # For the iPad mini and the first- and second-generation iPad (@1× display) on iOS ≤ 6
		 76   # For the iPad mini and the first- and second-generation iPad (@1× display) on iOS ≥ 7
		114   # For iPhone with @2× display running iOS ≤ 6:
		120   # For iPhone with @2× display running iOS ≥ 7
		144   # For iPad with @2× display running iOS ≤ 6
		152   # For iPad with @2× display running iOS ≤ 7
		167   # For iPad Pro with @2× display running iOS ≤ 9
		180   # For iPhone 6 Plus with @3× display
		192   # For Chrome for Android
		228   # For Coast for iOS
		 64   # Windows site icons, Safari Reading List, Modern browsers
		 96   # Google TV Favicon
		195   # Opera Speed Dial icon
		512   # General share icon
	]
		task = "icons_share_#{size}"

		gulp.task task, ((size) -> return ->
			imagemin = require 'gulp-imagemin'
			gm       = require 'gulp-gm'

			return gulp.src PATH.files.iconsIcon, base:PATH.dir.root
				.pipe gm (gmfile, done) ->
					gmfile.identify (err, info) ->
						gmfile = Util.gmOptimization gmfile.resize(size,size), info
						done null, gmfile
				.pipe rename (path) ->
					path.dirname = Util.assetsRename path.dirname
					path.basename = "icon-#{size}"
					return
				.pipe imagemin Util.imageminParams
				.pipe gulp.dest PATH.dir.build
		)(size)

		tasks.push task

	return tasks
)(), ->
	imagemin = require 'gulp-imagemin'

	return gulp.src [PATH.files.iconsLarge], base:PATH.dir.root
		.pipe imagemin Util.imageminParams
		.pipe rename (path) -> path.dirname = Util.assetsRename path.dirname; return
		.pipe gulp.dest PATH.dir.build



#-- windows tile
# http://msdn.microsoft.com/en-us/library/ie/dn455106(v=vs.85).aspx
# http://msdn.microsoft.com/en-us/library/ie/bg183312(v=vs.85).aspx
gulp.task 'icons_tile', ( ->
	tasks = []

	for name, size of {
		'small':  128   # officially:  70 x  70 | recommended: 128 x 128
		'medium': 270   # officially: 150 x 150 | recommended: 270 x 270
		'large':  558   # officially: 310 x 310 | recommended: 558 x 558
	}
		task = "icons_tile_#{name}"

		gulp.task task, ((name, size) -> return ->
			imagemin = require 'gulp-imagemin'
			gm       = require 'gulp-gm'

			return gulp.src PATH.files.iconsTile, base:PATH.dir.root
				.pipe gm (gmfile, done) ->
					gmfile.identify (err, info) ->
						Util.gmOptimization gmfile.resize(size,size), info
						done null, gmfile
				.pipe rename (path) ->
					path.dirname = Util.assetsRename path.dirname
					path.basename = "tile-#{name}"
					return
				.pipe imagemin Util.imageminParams
				.pipe gulp.dest PATH.dir.build
		)(name, size)

		tasks.push task

	return tasks
)(), ->
	imagemin = require 'gulp-imagemin'
	gm       = require 'gulp-gm'

	return gulp.src PATH.files.iconsTile, base:PATH.dir.root
		.pipe gm (gmfile, done) ->
			gmfile.identify (err, info) ->
				gmfile = Util.gmOptimization gmfile.resize(270,270), info
				gmfile.background('transparent').gravity('Center').extent(558,270)   # officially:  310 x 150 | recommended: 558 x 270
				done null, gmfile
		.pipe rename (path) ->
			path.dirname = Util.assetsRename path.dirname
			path.basename = 'tile-wide'
			return
		.pipe imagemin Util.imageminParams
		.pipe gulp.dest PATH.dir.build






#-- Rebuild
gulp.task 'icons', (cb) ->
	del         = require 'del'
	runsequence = require 'run-sequence'

	del.sync PATH.dir.buildIcons, force:true
	runsequence ['icons_favicon', 'icons_share', 'icons_tile'], cb


