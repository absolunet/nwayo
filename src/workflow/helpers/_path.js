//-------------------------------------
//-- Path
//-------------------------------------
'use strict';

global.nwayo.path = (() => {
	const NOLINT = '{theme,vendor}';

	const pattern = {};
	pattern.anytree = '**';

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

	const dir = {};
	dir.root          = '.';
	dir.cache         = `${dir.root}/.nwayo-cache`;
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
	dir.bower         = `${dir.root}/bower_components`;
	dir.misc          = `${dir.root}/misc`;
	dir.resources     = `${dir.misc}/resources`;
	dir.stubs         = `${dir.misc}/stubs`;

	const files = {};
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
	files.scriptsLint  = [files.scripts, `!${dir.scriptsNolint}/${pattern.anytree}/*`, `!${dir.scripts}/${pattern.anytree}/?(_)${NOLINT}*.${ext.scripts}`];
	files.styles       = `${dir.styles}/${pattern.anytree}/*.${ext.styles}`;
	files.stylesLint   = [files.styles, `!${dir.stylesNolint}/${pattern.anytree}/*`, `!${dir.styles}/${pattern.anytree}/?(_)${NOLINT}*.${ext.styles}`];
	files.templates    = `${dir.templates}/${pattern.anytree}/*.${ext.templates}`;

	const filename = {};
	filename.konstan        = 'konstan';
	filename.konstanLocal   = `${filename.konstan}.json`;
	filename.konstanScripts = `${filename.konstan}.${ext.scripts}`;
	filename.konstanStyles  = `${filename.konstan}.json`;

	const config = {};
	config.konstan  = `${dir.root}/konstan.yaml`;
	config.pkg      = `${dir.root}/package.json`;
	config.scsslint = `${dir.root}/.scss-lint.yml`;

	return { pattern, ext, build, dir, files, filename, config };
})();
