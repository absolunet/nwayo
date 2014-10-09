#debug  = require 'gulp-debug'
gulp   = require 'gulp'
rename = require 'gulp-rename'

util  = require './_util'
path  = util.path()


# https://github.com/gleero/grunt-favicons
# https://github.com/audreyr/favicon-cheat-sheet


#-- favicon.ico
# https://mathiasbynens.be/notes/rel-shortcut-icon
gulp.task 'icons_favicon', () ->
	mkdirp = require 'mkdirp'
	paths  = require 'path'
	im     = require 'imagemagick'
	glob   = require 'glob'

	for file in (glob.sync path.files.icons_favicon, mark:true)
		out = paths.dirname "#{path.dir.build}/" + util.assets_rename( file.substring( path.dir.root.length + 1 ) )
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
				console.log stdout



#-- favicon + touch icon
# https://mathiasbynens.be/notes/touch-icons
# https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/MobileHIG/IconMatrix.html
# https://developer.chrome.com/multidevice/android/installtohomescreen
# http://operacoast.com/developer
gulp.task 'icons_favtouch', (() ->
	tasks = []

	for name, size of {
		'touch-icon-57':   57   # For non-Retina (@1× display) iPhone, iPod Touch, and Android 2.1+ devices
		'touch-icon-72':   72   # For the iPad mini and the first- and second-generation iPad (@1× display) on iOS ≤ 6
		'touch-icon-76':   76   # For the iPad mini and the first- and second-generation iPad (@1× display) on iOS ≥ 7
		'touch-icon-114': 114   # For iPhone with @2× display running iOS ≤ 6:
		'touch-icon-120': 120   # For iPhone with @2× display running iOS ≥ 7
		'touch-icon-144': 144   # For iPad with @2× display running iOS ≤ 6
		'touch-icon-152': 152   # For iPad with @2× display running iOS ≤ 7
		'touch-icon-180': 180   # For iPhone 6 Plus with @3× display
		'touch-icon-192': 192   # For Chrome for Android
		'touch-icon-228': 228   # For Coast for iOS
		'favicon-64':      64   # Windows site icons, Safari Reading List, Modern browsers
		'favicon-96':      96   # Google TV Favicon
		'favicon-195':    195   # Opera Speed Dial icon
	}
		task = "icons_png_#{name}"

		gulp.task task, ((name, size) -> return () ->
			imagemin = require 'gulp-imagemin'
			gm       = require 'gulp-gm'

			return gulp.src path.files.icons_favtouch
				.pipe gm (gmfile, done) ->
					gmfile.identify (err, info) ->
						util.gm_optimization gmfile.resize(size,size), info
						done null, gmfile
				.pipe rename (path) ->
					path.dirname = util.assets_rename path.dirname
					path.basename = name
					return
				.pipe imagemin util.imagemin_params()
				.pipe gulp.dest path.dir.build
		)(name, size)

		tasks.push task

	return tasks
)()



#<!-- Tile icon for Win8 (144x144 + tile color) -->
#<meta name="msapplication-TileImage" content="images/touch/ms-touch-icon-144x144-precomposed.png">
#<meta name="msapplication-TileColor" content="#3372DF">

# windows-tile-144x144.png (144x144) — Windows 8 tile;

# share image
# facebook image







#-- Rebuild
gulp.task 'icons', (cb) ->
	del         = require 'del'
	runsequence = require 'run-sequence'

	del [path.dir.build_icons], force:true, ->
		runsequence ['icons_favicon', 'icons_favtouch'], cb


