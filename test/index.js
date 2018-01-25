//--------------------------------------------------------
//-- Tests
//--------------------------------------------------------
'use strict';

const path   = require('path');
const slash  = require('slash');
const tester = require('@absolunet/tester');

tester.lintJs(['**/*.js', '!node_modules/**/*', '!boilerplate/node_modules/**/*', '!boilerplate/bower_components/**/*', '!boilerplate/components/**/scripts/vendor/**/*.js', '!test/fixtures/**/*.js']);

tester.lintScss(['boilerplate/components/**/*.scss'], slash(path.normalize(`${__dirname}/../boilerplate/.stylelintrc.yaml`)));
