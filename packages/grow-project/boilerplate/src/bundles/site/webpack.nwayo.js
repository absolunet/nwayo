'use strict';

const nwayo = require('@nwayo/api');


nwayo
	.destination(`dist/nwayo/${nwayo.bundle}`)
	.react(nwayo.pathFromBundle('scripts/main.js'), 'scripts/main.js')
	.sass(nwayo.pathFromBundle('styles/main.scss'), 'styles/main.css')
;
