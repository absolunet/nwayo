'use strict';

const LaravelMixBuilder    = require('./LaravelMixBuilder');
const LaravelMixApiFactory = require('./LaravelMixApiFactory');


const factory = new LaravelMixApiFactory();


module.exports = {
	builder: new LaravelMixBuilder(factory),
	factory
};
