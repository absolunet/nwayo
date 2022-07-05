//--------------------------------------------------------
//-- SassDoc builder
//--------------------------------------------------------
'use strict';

const fss = require('@absolunet/fss');
const sassdoc = require('sassdoc');

const paths   = {};
paths.root    = fss.realpath(`${__dirname}/../..`);
paths.toolbox = `${paths.root}/packages/toolbox`;
paths.source  = `${paths.toolbox}/styles/`;
paths.output  = `${paths.root}/docs/toolbox/styles`;


sassdoc(paths.source, {
	'dest':    paths.output,  // eslint-disable-line unicorn/prevent-abbreviations
	'package': `${paths.toolbox}/package.json`,
	'strict': true,
	'verbose': true,
	'display': {
		access: ['public']
	},
	'basePath': 'https://github.com/absolunet/nwayo/blob/production/packages/toolbox/styles'
});


// Add CSS
