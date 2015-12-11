//-------------------------------------
//-- Path
//-------------------------------------
'use strict';

const BOWER  = 'bower_components';
const CACHE  = '.nwayo-cache';
const NOLINT = 'vendor';

let pattern = {};
pattern.anytree = '**';
pattern.babel   = new RegExp(`^\\${CACHE}|${BOWER}|components\/${NOLINT}\-|components\/.*\/(_?)${NOLINT}\-`);

let ext = {};
ext.bundles   = 'yaml';
ext.fonts     = '{eot,svg,ttf,woff,woff2}';
ext.images    = '{gif,jpg,png,svg}';
ext.scripts   = 'js';
ext.styles    = 'scss';
ext.templates = 'jshtml';

let build = {};
build.fonts   = 'fonts';
build.icons   = 'icons';
build.images  = 'images';
build.raw     = 'raw';
build.scripts = 'scripts';
build.styles  = 'styles';

let dir = {};
dir.root          = '.';
dir.cache         = `${dir.root}/${CACHE}`;
dir.cacheInline   = `${dir.cache}/inline-images`;
dir.cacheSass     = `${dir.cache}/sass`;
dir.cacheScripts  = `${dir.cache}/${build.scripts}`;
dir.cacheStyles   = `${dir.cache}/${build.styles}`;
dir.bundles       = `${dir.root}/bundles`;
dir.components    = `${dir.root}/components`;
dir.assets        = `${dir.components}/${pattern.anytree}/assets`;
dir.fonts         = `${dir.assets}/fonts`;
dir.icons         = `${dir.assets}/icons`;
dir.images        = `${dir.assets}/images`;
dir.inline        = `${dir.assets}/inline-images`;
dir.raw           = `${dir.assets}/raw`;
dir.scripts       = `${dir.components}/${pattern.anytree}/scripts`;
dir.scriptsNolint = `${dir.components}/${NOLINT}-*/scripts`;
dir.styles        = `${dir.components}/${pattern.anytree}/styles`;
dir.stylesNolint  = `${dir.components}/${NOLINT}-*/styles`;
dir.templates     = `${dir.components}/${pattern.anytree}/templates`;
dir.bower         = `${dir.root}/${BOWER}`;
dir.misc          = `${dir.root}/misc`;
dir.resources     = `${dir.misc}/resources`;
dir.stubs         = `${dir.misc}/stubs`;

let files = {};
files.bundles      = `${dir.bundles}/${pattern.anytree}/*.${ext.bundles}`;
files.fonts        = `${dir.fonts}/${pattern.anytree}/*.${ext.fonts}`;
files.iconsFavicon = `${dir.icons}/favicon.png`;
files.iconsIcon    = `${dir.icons}/icon.png`;
files.iconsLarge   = `${dir.icons}/large.png`;
files.iconsTile    = `${dir.icons}/tile.png`;
files.images       = `${dir.images}/${pattern.anytree}/*.${ext.images}`;
files.images2x     = `${dir.images}/${pattern.anytree}/*\@2x.${ext.images}`;
files.inline       = `${dir.inline}/${pattern.anytree}/*.${ext.images}`;
files.raw          = `${dir.raw}/${pattern.anytree}/*`;
files.scripts      = `${dir.scripts}/${pattern.anytree}/*.${ext.scripts}`;
files.scriptsLint  = [files.scripts, `!${dir.scriptsNolint}/${pattern.anytree}/*`, `!${dir.scripts}/${pattern.anytree}/?(_)${NOLINT}-*.${ext.scripts}`];
files.styles       = `${dir.styles}/${pattern.anytree}/*.${ext.styles}`;
files.stylesLint   = [files.styles, `!${dir.stylesNolint}/${pattern.anytree}/*`, `!${dir.styles}/${pattern.anytree}/?(_)${NOLINT}-*.${ext.styles}`];
files.templates    = `${dir.templates}/${pattern.anytree}/*.${ext.templates}`;

let filename = {};
filename.konstan        = 'konstan';
filename.konstanLocal   = `${filename.konstan}.json`;
filename.konstanScripts = `${filename.konstan}.${ext.scripts}`;
filename.konstanStyles  = `${filename.konstan}.json`;
filename.modernizr      = `modernizr`;

let config = {};
config.konstan   = `${dir.root}/konstan.yaml`;
config.pkg       = `${dir.root}/package.json`;
config.scsslint  = `${dir.root}/.scss-lint.yml`;
config.modernizr = `${dir.root}/modernizr.yaml`;




class Path {
	static get pattern()  { return pattern; }
	static get ext()      { return ext; }
	static get build()    { return build; }
	static get dir()      { return dir; }
	static get files()    { return files; }
	static get filename() { return filename; }
	static get config()   { return config; }
}

global.nwayo.path = Path;
