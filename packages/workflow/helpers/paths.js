//-------------------------------------
//-- Paths
//-------------------------------------
'use strict';

const findUp = require('find-up');
const path   = require('path');
const slash  = require('slash');
const fss    = require('@absolunet/fss');


const BOWER            = 'bower_components';
const CACHE            = '.nwayo-cache';
const NOLINT           = 'vendor';
const MAIN_CONFIG      = 'nwayo.yaml';
const MAIN_CONFIG_PATH = findUp.sync(MAIN_CONFIG, { cwd:process.cwd() });

const ROOT = (() => {
	const prjConfig = fss.readYaml(MAIN_CONFIG_PATH);

	return slash(path.normalize(`${path.dirname(MAIN_CONFIG_PATH)}/${prjConfig.root}`)).replace(/\/$/u, '');
})();






const pattern = {};
pattern.anytree = '**';
pattern.babel   = `^\\/?##includes##(\\${CACHE}|${BOWER}|components\\/.*\\/scripts\\/${NOLINT}\\/)`;  // https://regex101.com/r/kIKuJW/1

const ext = {};
ext.bundles     = 'yaml';
ext.fonts       = '{woff,woff2}';
ext.images      = '{gif,jpg,png,svg}';
ext.scripts     = 'js';
ext.styles      = 'scss';
ext.stylesBuild = 'css';
ext.templates   = 'jshtml';

const build = {};
build.fonts   = 'fonts';
build.icons   = 'icons';
build.images  = 'images';
build.raw     = 'raw';
build.scripts = 'scripts';
build.styles  = 'styles';

const folder = {};
folder.cache                = CACHE;
folder.cacheInline          = `${folder.cache}/inline-images`;
folder.cacheScripts         = `${folder.cache}/${build.scripts}`;
folder.cacheStyles          = `${folder.cache}/${build.styles}`;
folder.vendors              = BOWER;
folder.bundles              = 'bundles';
folder.components           = 'components';
folder.assets               = 'assets';
folder.fonts                = 'fonts';
folder.icons                = 'icons';
folder.images               = 'images';
folder.inlineImages         = 'inline-images';
folder.raw                  = 'raw';
folder.extensions           = 'extensions';
folder.scripts              = 'scripts';
folder.styles               = 'styles';
folder.templates            = 'templates';
folder.misc                 = 'misc';
folder.workflowDependencies = 'node_modules';
folder.nolint               = NOLINT;

const filename = {};
filename.konstan        = 'konstan';
filename.konstanLocal   = `${filename.konstan}.json`;
filename.konstanScripts = `${filename.konstan}.${ext.scripts}`;
filename.konstanStyles  = `${filename.konstan}.json`;
filename.lodash         = `lodash`;
filename.modernizr      = `modernizr`;
filename.mainConfig     = MAIN_CONFIG;
filename.iconsFavicon   = `favicon.png`;
filename.iconsTouch     = `touch.png`;
filename.iconsIcon      = `icon.png`;
filename.iconsLarge     = `large.png`;
filename.iconsTile      = `tile.png`;

const dir = {};
dir.root         = ROOT;
dir.cache        = `${dir.root}/${folder.cache}`;
dir.cacheInline  = `${dir.root}/${folder.cacheInline}`;
dir.cacheSass    = `${dir.root}/${folder.cacheSass}`;
dir.cacheScripts = `${dir.root}/${folder.cacheScripts}`;
dir.cacheStyles  = `${dir.root}/${folder.cacheStyles}`;
dir.bundles      = `${dir.root}/${folder.bundles}`;
dir.components   = `${dir.root}/${folder.components}`;
dir.assets       = `${dir.components}/${pattern.anytree}/${folder.assets}`;
dir.fonts        = `${dir.assets}/${folder.fonts}`;
dir.icons        = `${dir.assets}/${folder.icons}`;
dir.images       = `${dir.assets}/${folder.images}`;
dir.inline       = `${dir.assets}/${folder.inlineImages}`;
dir.raw          = `${dir.assets}/${folder.raw}`;
dir.extensions   = `${dir.components}/${pattern.anytree}/${folder.extensions}`;
dir.scripts      = `${dir.components}/${pattern.anytree}/${folder.scripts}`;
dir.styles       = `${dir.components}/${pattern.anytree}/${folder.styles}`;
dir.templates    = `${dir.components}/${pattern.anytree}/${folder.templates}`;
dir.bower        = `${dir.root}/${folder.vendors}`;
dir.misc         = `${dir.root}/${folder.misc}`;
dir.resources    = `${dir.misc}/resources`;
dir.stubs        = `${dir.misc}/stubs`;

const files = {};
files.bundles      = `${dir.bundles}/${pattern.anytree}/*.${ext.bundles}`;
files.fonts        = `${dir.fonts}/${pattern.anytree}/*.${ext.fonts}`;
files.iconsFavicon = `${dir.icons}/${filename.iconsFavicon}`;
files.iconsTouch   = `${dir.icons}/${filename.iconsTouch}`;
files.iconsIcon    = `${dir.icons}/${filename.iconsIcon}`;
files.iconsLarge   = `${dir.icons}/${filename.iconsLarge}`;
files.iconsTile    = `${dir.icons}/${filename.iconsTile}`;
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

const workflow = {};
workflow.root       = slash(path.normalize(`${__dirname}/..`));
workflow.cliTasks   = `${workflow.root}/cli`;
workflow.tasks      = `${workflow.root}/tasks`;
workflow.ressources = `${workflow.root}/ressources`;
workflow.matrix     = `${workflow.ressources}/doctor-matrix`;

const config = {};
config.main            = MAIN_CONFIG_PATH;
config.bower           = `${dir.root}/bower.json`;
config.konstan         = `${dir.root}/konstan.yaml`;
config.projectPackage  = `${dir.root}/package.json`;
config.workflowPackage = `${workflow.root}/package.json`;
config.sassFunctions   = `${workflow.ressources}/dart-sass-functions.js`;
config.stylelint       = `${dir.root}/.stylelintrc.yaml`;
config.modernizr       = `${dir.root}/modernizr.yaml`;
config.lodash          = `${dir.root}/lodash.yaml`;
config.lodashBin       = slash(require.resolve('lodash-cli'));
config.babelPresetEnv  = slash(require.resolve('@babel/preset-env'));
config.bowerBin        = slash(`${path.dirname(require.resolve('bower'))}/../bin/bower`);






class Paths {

	get pattern()  { return pattern; }
	get ext()      { return ext; }
	get build()    { return build; }
	get folder()   { return folder; }
	get dir()      { return dir; }
	get files()    { return files; }
	get filename() { return filename; }
	get workflow() { return workflow; }
	get config()   { return config; }

}


module.exports = new Paths();