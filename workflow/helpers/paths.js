//-------------------------------------
//-- Paths
//-------------------------------------
'use strict';

const findUp  = require('find-up');
const path    = require('path');
const slash   = require('slash');
const toolbox = require('./toolbox');


//-- Static properties
const STATIC = global.___NwayoPaths___ ? global.___NwayoPaths___ : global.___NwayoPaths___ = {
	root: (() => {
		const prjConfigFilepath = findUp.sync('nwayo.yaml', { cwd:process.cwd() });
		const prjConfig         = toolbox.readYAML(prjConfigFilepath);

		return path.normalize(`${path.dirname(prjConfigFilepath)}/${prjConfig.root}`);
	})()
};






const BOWER  = 'bower_components';
const CACHE  = '.nwayo-cache';
const NOLINT = 'vendor';

const pattern = {};
pattern.anytree = '**';
pattern.babel   = `^/?##includes##(\\${CACHE}|${BOWER}|components/.*/scripts/${NOLINT}/)`;  // https://regex101.com/r/kIKuJW/1

const ext = {};
ext.bundles   = 'yaml';
ext.fonts     = '{eot,svg,ttf,woff,woff2}';
ext.images    = '{gif,jpg,png,svg}';
ext.scripts   = 'js';
ext.styles    = 'scss';
ext.templates = 'jshtml';

const build = {};
build.fonts   = 'fonts';
build.icons   = 'icons';
build.images  = 'images';
build.raw     = 'raw';
build.scripts = 'scripts';
build.styles  = 'styles';

const folder = {};
folder.cache        = CACHE;
folder.cacheInline  = `${folder.cache}/inline-images`;
folder.cacheSass    = `${folder.cache}/sass`;
folder.cacheScripts = `${folder.cache}/${build.scripts}`;
folder.cacheStyles  = `${folder.cache}/${build.styles}`;

const dir = {};
dir.root         = STATIC.root;
dir.cache        = `${dir.root}/${folder.cache}`;
dir.cacheInline  = `${dir.root}/${folder.cacheInline}`;
dir.cacheSass    = `${dir.root}/${folder.cacheSass}`;
dir.cacheScripts = `${dir.root}/${folder.cacheScripts}`;
dir.cacheStyles  = `${dir.root}/${folder.cacheStyles}`;
dir.bundles      = `${dir.root}/bundles`;
dir.components   = `${dir.root}/components`;
dir.assets       = `${dir.components}/${pattern.anytree}/assets`;
dir.fonts        = `${dir.assets}/fonts`;
dir.icons        = `${dir.assets}/icons`;
dir.images       = `${dir.assets}/images`;
dir.inline       = `${dir.assets}/inline-images`;
dir.raw          = `${dir.assets}/raw`;
dir.scripts      = `${dir.components}/${pattern.anytree}/scripts`;
dir.styles       = `${dir.components}/${pattern.anytree}/styles`;
dir.templates    = `${dir.components}/${pattern.anytree}/templates`;
dir.bower        = `${dir.root}/${BOWER}`;
dir.misc         = `${dir.root}/misc`;
dir.resources    = `${dir.misc}/resources`;
dir.stubs        = `${dir.misc}/stubs`;

const files = {};
files.bundles      = `${dir.bundles}/${pattern.anytree}/*.${ext.bundles}`;
files.fonts        = `${dir.fonts}/${pattern.anytree}/*.${ext.fonts}`;
files.iconsFavicon = `${dir.icons}/favicon.png`;
files.iconsTouch   = `${dir.icons}/touch.png`;
files.iconsIcon    = `${dir.icons}/icon.png`;
files.iconsLarge   = `${dir.icons}/large.png`;
files.iconsTile    = `${dir.icons}/tile.png`;
files.images       = `${dir.images}/${pattern.anytree}/*.${ext.images}`;
files.images2x     = `${dir.images}/${pattern.anytree}/*@2x.${ext.images}`;
files.inline       = `${dir.inline}/${pattern.anytree}/*.${ext.images}`;
files.raw          = `${dir.raw}/${pattern.anytree}/*`;
files.scripts      = `${dir.scripts}/${pattern.anytree}/*.${ext.scripts}`;
files.scriptsLint  = [files.scripts, `!${dir.scripts}/${NOLINT}/${pattern.anytree}/*`];
files.styles       = `${dir.styles}/${pattern.anytree}/*.${ext.styles}`;
files.stylesLint   = [files.styles, `!${dir.styles}/${NOLINT}/${pattern.anytree}/*`];
files.templates    = `${dir.templates}/${pattern.anytree}/*.${ext.templates}`;
files.bowerScripts = `${dir.bower}/${pattern.anytree}/*.${ext.scripts}`;

const filename = {};
filename.konstan        = 'konstan';
filename.konstanLocal   = `${filename.konstan}.json`;
filename.konstanScripts = `${filename.konstan}.${ext.scripts}`;
filename.konstanStyles  = `${filename.konstan}.json`;
filename.modernizr      = `modernizr`;
filename.lodash         = `lodash`;

const workflow = {};
workflow.root       = slash(path.normalize(`${__dirname}/..`));
workflow.cliTasks   = `${workflow.root}/cli`;
workflow.tasks      = `${workflow.root}/tasks`;
workflow.ressources = `${workflow.root}/ressources`;

const config = {};
config.bower           = `${dir.root}/bower.json`;
config.konstan         = `${dir.root}/konstan.yaml`;
config.projectPackage  = `${dir.root}/package.json`;
config.workflowPackage = `${workflow.root}/package.json`;
config.sass            = `${workflow.ressources}/sass.rb`;
config.stylelint       = `${dir.root}/.stylelintrc.yaml`;
config.modernizr       = `${dir.root}/modernizr.yaml`;
config.lodash          = `${dir.root}/lodash.yaml`;
config.lodashBin       = slash(require.resolve('lodash-cli'));
config.babelPresetEnv  = slash(require.resolve('babel-preset-env'));
config.bowerBin        = slash(`${path.dirname(require.resolve('bower'))}/../bin/bower`);






module.exports = class paths {

	static get pattern()  { return pattern; }
	static get ext()      { return ext; }
	static get build()    { return build; }
	static get folder()   { return folder; }
	static get dir()      { return dir; }
	static get files()    { return files; }
	static get filename() { return filename; }
	static get workflow() { return workflow; }
	static get config()   { return config; }

};
