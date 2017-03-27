//--------------------------------------------------------
//-- Tests
//--------------------------------------------------------
'use strict';

const tester = require('@absolunet/tester');

tester.lintJs([...tester.ALL_JS, 'dist/!(bower_components|node_modules)/**/*.js']);
