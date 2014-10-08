#debug  = require 'gulp-debug'
gulp   = require 'gulp'
rename = require 'gulp-rename'

util  = require './_util'
path  = util.path()


# https://github.com/gleero/grunt-favicons
# https://github.com/audreyr/favicon-cheat-sheet


#-- favicon.ico
# https://mathiasbynens.be/notes/rel-shortcut-icon
ico: [
	16  # IE9 address bar, Pinned site Jump List/Toolbar/Overlay
	24  # IE9 Pinned site browser UI
	32  # New tab page in IE, taskbar button in Win 7+, Safari Read Later sidebar
	48  # Windows site icons
]


#-- png
# https://mathiasbynens.be/notes/touch-icons
# https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/MobileHIG/IconMatrix.html
# https://developer.chrome.com/multidevice/android/installtohomescreen
# http://operacoast.com/developer
tasks_png = []
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

	gulp.task task, ((name, size, stream) -> return () ->
		imagemin = require 'gulp-imagemin'
		gm       = require 'gulp-gm'

		return stream
			.pipe gm (gmfile, done) ->
				gmfile.identify (err, info) ->
					util.gm_optimization gmfile.resize(size,size), info
					done null, gmfile
			.pipe rename (path) ->
				path.dirname  = './'
				path.basename = name
				return
			.pipe imagemin util.imagemin_params()
			.pipe gulp.dest path.dir.build
	)(name, size, gulp.src "#{path.dir.icons}/icon.png")

	tasks_png.push task

gulp.task 'icons_png', tasks_png




			#<meta name="mobile-web-app-capable" content="yes">
			#<link rel="icon" sizes="192x192" href="images/touch/chrome-touch-icon-192x192.png">

			#<!-- Add to homescreen for Safari on iOS -->
			#<meta name="apple-mobile-web-app-capable" content="yes">
			#<meta name="apple-mobile-web-app-status-bar-style" content="black">
			#<meta name="apple-mobile-web-app-title" content="Web Starter Kit">
			#<link rel="apple-touch-icon-precomposed" href="images/touch/apple-touch-icon-precomposed.png">

			#<!-- Tile icon for Win8 (144x144 + tile color) -->
			#<meta name="msapplication-TileImage" content="images/touch/ms-touch-icon-144x144-precomposed.png">
			#<meta name="msapplication-TileColor" content="#3372DF">

			# favicon.ico (16x16, 32x32, 48x48) — desktop browsers, address bar, tabs, safari reading list, non-retina iPhone, windows 7+ taskbar, windows desktop;
			# favicon.png (64x64) — modern browsers;
			# apple-touch-icon.png (57x57) — iPhone non-retina, Android 2.1+;
			# apple-touch-icon-60x60.png (60x60) — iPhone iOS7+;
			# apple-touch-icon-72x72.png (72x72) — iPad non-retina;
			# apple-touch-icon-76x76.png (76x76) — iPad non-retina iOS 7;
			# apple-touch-icon-114x114.png (114x114) — iPhone retina, iOS 6 and lower;
			# apple-touch-icon-120x120.png (120x120) — iPhone retina, iOS 7 and higher;
			# apple-touch-icon-144x144.png (144x144) — iPad retina;
			# apple-touch-icon-152x152.png (152x152) — iPad retina iOS 7;
			# windows-tile-144x144.png (144x144) — Windows 8 tile;
			# coast-icon-228x228.png (228x228) - Coast browser;
			# firefox-icon-16x16.png (16x16) - Firefox on Android / Windows;
			# firefox-icon-30x30.png (30x30) - Firefox OS;
			# firefox-icon-32x32.png (32x32) - Firefox on Android / Windows;
			# firefox-icon-48x48.png (48x48) - Firefox on Android / Windows;
			# firefox-icon-60x60.png (60x60) - Firefox OS;
			# firefox-icon-64x64.png (64x64) - Firefox on Android / Windows;
			# firefox-icon-90x90.png (90x90) - Firefox OS;
			# firefox-icon-120x120.png (120x120) - Firefox OS;
			# firefox-icon-128x128.png (128x128) - Firefox on Android / Windows;
			# firefox-icon-256x256.png (256x256) - Firefox on Android / Windows;
			# homescreen-196x196.png (196x196) - Android Homescreen.


#	(function(sizes) {
#		tasks.icons = ['nwayo_loghead:icons'];
#
#		// apple touch icons
#		var applecopytasks = [];
#
#		for (var i in sizes) {
#			var size = sizes[i];
#
#			config['imagemagick-resize']['apple-'+size] = {
#				from:  assets+'/icons/',
#				to:    tmp+'/icons/apple-'+size+'/',
#				files: 'share.png',
#				props: { width:size, height:size }
#			};
#
#			config.nwayo_copy['apple-'+size] = { files: [{
#				src:  tmp+'/icons/apple-'+size+'/share.png',
#				dest: builds+'/touch-icon-'+size+'.png'
#			}]};
#
#			tasks.icons.push('imagemagick-resize:apple-'+size);
#			applecopytasks.push('nwayo_copy:apple-'+size);
#		}
#
#		config.imagemin.icons_apple = {
#			options: { optimizationLevel:7, progressive:false, interlaced:false, pngquant:true, force:true },
#			files: [{
#				expand: true,
#				cwd: tmp+'/icons/',
#				src: ['**/*.{png,jpg,gif}'],
#				dest: tmp+'/icons/'
#			}]
#		};
#		tasks.icons.push('imagemin:icons_apple');
#		tasks.icons = tasks.icons.concat(applecopytasks);
#
#
#		// share
#		config.imagemin.icons_share = {
#			options: { optimizationLevel:7, progressive:false, interlaced:false, pngquant:true, force:true },
#			files: [
#				{
#					src:  assets+'/icons/share.png',
#					dest: builds+'/share-icon.png'
#				},
#				{
#					src:  assets+'/icons/facebook.png',
#					dest: builds+'/facebook-image.png'
#				}
#			]
#		};
#		tasks.icons.push('imagemin:icons_share');
#
#
#		// favicon
#		config['imagemagick-convert'].favicon = {
#			args: [assets+'/icons/favicon.png', '(', '-clone', '0', '-resize', '16x16', ')', '(', '-clone', '0', '-resize', '32x32', ')', '-delete', '0', builds+'/favicon.ico']
#		};
#
#		tasks.icons.push('imagemagick-convert:favicon');
#
#
#		// grunt
#		config.clean.tmp_icons = { src: [tmp+'/icons'], options: { force: true }};
#		tasks.icons.push('clean:tmp_icons');
#
#		tasks.rebuild.push('icons');
#
#		config.watch.icons = {
#			files: [assets+'/icons/**/*.png'],
#			tasks: 'icons'
#		};
#
#	})([57,72,76,114,120,144,152]);
