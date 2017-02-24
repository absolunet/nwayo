//--------------------------------------------------------
//-- Tests - Lint js
//--------------------------------------------------------
'use strict';

const lint = require('mocha-eslint');

lint([
	'dist/!(bower_components|node_modules)/**/*.js',
	'**!(node_modules)/*.js'
], { strict:true });
