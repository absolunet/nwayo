//--------------------------------------------------------
//-- Tests
//--------------------------------------------------------
'use strict';

const tester = require('@absolunet/tester');

tester.lintJs(['**/*.js', '!node_modules/**/*', '!boilerplate/node_modules/**/*', '!boilerplate/bower_components/**/*', '!boilerplate/components/**/scripts/vendor/**/*.js', '!test/fixtures/**/*.js']);
