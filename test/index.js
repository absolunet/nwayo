//--------------------------------------------------------
//-- Tests
//--------------------------------------------------------
'use strict';

const tester = require('@absolunet/tester');

tester.lintJs(['**/*.js', '!node_modules/**/*', '!boilerplate/node_modules/**/*', '!boilerplate/bower_components/**/*', '!src/**/*', '!boilerplate/components/**/scripts/vendor/**/*.js']);
