//--------------------------------------------------------
//-- Docs builder
//--------------------------------------------------------
"use strict";

const path = require("path");

module.exports = {
	entry: "./app/index.js",
	mode: "development",
	module: {
		rules: [
			{
				test: /\.(?<extension>js|jsx)$/u,
				exclude: /(?<directory>node_modules)/u,
				loader: "babel-loader",
				options: { presets: ["@babel/env", "@babel/preset-react"] },
			},
		],
	},
	resolve: { extensions: ["*", ".js", ".jsx"] },
	output: {
		path: path.resolve(__dirname, "../../docs/static/scripts"),
		publicPath: "/nwayo/static/scripts",
		filename: "app.js",
	},
	// eslint-disable-next-line unicorn/prevent-abbreviations
	devServer: {
		static: {
			directory: path.join(__dirname, "local-server"),
		},
		port: 3000,
		hot: "only",
	},
};
