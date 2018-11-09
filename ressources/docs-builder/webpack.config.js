//--------------------------------------------------------
//-- Docs builder
//--------------------------------------------------------
'use strict';

const path    = require('path');
const webpack = require('webpack');


module.exports = {
	entry: './app/index.js',
	mode:  'development',
	module: {
		rules: [{
			test:    /\.(js|jsx)$/u,
			exclude: /(node_modules|bower_components)/u,
			loader:  'babel-loader',
			options: { presets:['@babel/env', '@babel/preset-react'] }
		}]
	},
	resolve: { extensions:['*', '.js', '.jsx'] },
	output: {
		path:       path.resolve(__dirname, '../../docs/static/scripts'),
		publicPath: '/nwayo/static/scripts',
		filename:   'app.js'
	},
	devServer: {
		contentBase: path.join(__dirname, 'local-server'),
		port:        3000,
		publicPath:  'http://localhost:3000/nwayo/static/scripts',
		hotOnly:     true
	},
	plugins: [new webpack.HotModuleReplacementPlugin()]
};
