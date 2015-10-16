//-------------------------------------
//-- Icons
//-------------------------------------
'use strict';

//let debug  = require('gulp-debug');
let gulp   = require('gulp');
let rename = require('rename');

const PATH = global.nwayo.path;
const ENV  = global.nwayo.env;
const Util = global.nwayo.util;




//-- Favicon.ico
// https://mathiasbynens.be/notes/rel-shortcut-icon


//-- Share icons
// https://mathiasbynens.be/notes/touch-icons
// https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/MobileHIG/IconMatrix.html
// https://developer.chrome.com/multidevice/android/installtohomescreen
// http://operacoast.com/developer


//-- Windows tile
// http://msdn.microsoft.com/en-us/library/ie/dn455106(v=vs.85).aspx
// http://msdn.microsoft.com/en-us/library/ie/bg183312(v=vs.85).aspx


//-- Rebuild
gulp.task('icons', cb => {
	Util.taskGrouper({ cb,
		tasks:       ['icons_favicon', 'icons_share', 'icons_tile'],
		cleanBundle: (name, bundle) => {
			return [`${bundle.output.build}/${PATH.build.icons}`];
		}
	});
});
