'use strict';

const context     = require('../context');
const { builder } = require('../laravelMix');


const webpackConfig = context.bundles.map((bundle) => {
	return builder.build({ bundle });
}).filter(Boolean);


module.exports = webpackConfig;
