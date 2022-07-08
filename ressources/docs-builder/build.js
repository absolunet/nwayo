//--------------------------------------------------------
//-- Docs builder
//--------------------------------------------------------
'use strict';

/* eslint-disable node/no-unpublished-require */
const gulp          = require('gulp');
const cssnano       = require('gulp-cssnano');
const gulpsass      = require('gulp-dart-sass');
const uglify        = require('gulp-uglify');
const MarkdownIt    = require('markdown-it');
const anchor        = require('markdown-it-anchor');
const externalLinks = require('markdown-it-external-links');
const path          = require('path');
const scandirectory = require('scandirectory');
const sass          = require('sass');
const fss           = require('@absolunet/fss');
const include       = require('@absolunet/gulp-include');
const babel         = require('@babel/core');


const paths      = {};
paths.root       = fss.realpath(path.join(__dirname, '..','..'));
paths.ressources = `${paths.root}/ressources`;
paths.builder    = `${paths.ressources}/docs-builder`;
paths.assets     = `${paths.builder}/assets`;
paths.static     = `${paths.root}/docs/static`;

const ROOT = '/nwayo';


const parseTitle = (string) => {
	return (string.split('\n').shift().match(/^# (?<title>[^[]+)/u) || ['', 'Untitled'])[1];
};


const isBeingWritten = (string) => {
	return (/> Being written/u).test(string);
};

const processNav = (tree, section = '') => {
	const data = {};

	Object.keys(tree).forEach((page) => {
		const name    = page.replace('.md', '');
		const content = tree[page];
		const url     = `${section}/${name}`;

		if (!isBeingWritten(content) && !isBeingWritten(content['readme.md'])) {
			if (typeof content === 'string') {
				if (page !== 'readme.md') {
					data[name] = {
						source: url.slice(1),
						title:  parseTitle(content)
					};
				}
			} else {
				data[name] = {
					source: `${url.slice(1)}/readme`,
					title: parseTitle(content['readme.md'])
				};

				if (Object.keys(content).length > 1) {
					data[name].children = processNav(content, url);
				}
			}
		}

	});

	return data;
};






//-- Cleanup
fss.remove(paths.static);
fss.ensureDir(paths.static);


//-- Pages
scandirectory(`${paths.root}/documentation`, { readFiles: true }, (error, list, tree) => {
	if (!error) {

		const mainReadme = fss.readFile(`${paths.root}/readme.md`, 'utf8');
		list['readme.md'] = mainReadme;
		tree['readme.md'] = mainReadme;

		//-- Build nav
		const { version } = fss.readJson(`${paths.root}/lerna.json`);
		const navTree = processNav(tree);
		navTree.__root__ = { source: 'readme', title: `nwayo ${version} - Documentation` };
		navTree.__404__  = navTree['404'];
		delete navTree['404'];

		fss.outputFile(`${paths.builder}/app/helpers/generated/index.js`, `
			export const tree = ${JSON.stringify(navTree)};
			export const version = '${version}';
		`);


		//-- Markdown conversion
		const md = new MarkdownIt();
		md.normalizeLink = (link) => {
			if ((/^(?<protocol>http|\/)/u).test(link)) {
				return link;
			}

			return link
				.replace(/(?<extension>.md)$/u, '')
				.replace(/^(?<path>\.\.\/\.\.\/ressources\/images\/)/u, `${ROOT}/static/images/`)
			;
		};

		md.use(anchor, {
			level:     2,
			permalink: anchor.permalink.linkInsideHeader({
				'class':     'anchor',
				'symbol':    '⚭',
				'placement': 'before'
			})
		});

		md.use(externalLinks, {
			externalClassName: 'external',
			externalRel:       'external'  // eslint-disable-line unicorn/prevent-abbreviations
		});

		Object.keys(list).forEach((file) => {
			let content = list[file];

			// Exceptions for main readme
			if (file === 'readme.md') {
				md.set({ html: true });
				content = content
					.replaceAll(/\]\(documentation\//ug, `](${ROOT}/`)
					.replaceAll(/https:\/\/github.com\/absolunet\/nwayo\/raw\/production\/ressources\/images\//ug, `${ROOT}/static/images/`)
					.replaceAll(/nwayo\.png/ug, `nwayo.svg`)
					.replaceAll(/\[\/\/\]: # \(Doc\)(?<spaces>[\s\S]*?)\[\/\/\]: # \(\/Doc\)/ug, '')
				;
			} else {
				md.set({ html: false });
			}

			if (content !== 'dir' && !isBeingWritten(content)) {
				const outFile   = `${paths.static}/content/${file.replace('.md', '.html')}`;
				fss.outputFile(outFile, md.render(content));
			}
		});
	} else {
		throw error;
	}
});


//-- Build assets
fss.copy(`${paths.ressources}/images`, `${paths.static}/images`);
fss.copy(`${paths.root}/test/fixtures/build/icons/site`, `${paths.static}/icons`);

// SCSS
gulp.src(`${paths.assets}/styles/main.scss`)
	.pipe(gulpsass.sync({
		includePaths: [paths.assets],
		functions:    {
			'docsdart-read-file($file)': (parametersFile) => {
				const file = parametersFile.getValue();

				if (fss.exists(file)) {
					return new sass.types.String(fss.readFile(file, 'utf8'));
				}

				throw new Error(`File '${file}' not found`);
			}
		}
	})
		.on('error', gulpsass.logError))

	.pipe(cssnano({ reduceIdents: false, zindex: false }))
	.pipe(gulp.dest(`${paths.static}/styles`))
;

// JS
gulp.src(`${paths.assets}/scripts/main.js`)
	.pipe(include({
		basePath:      paths.assets,
		autoExtension: true,
		partialPrefix: true,
		fileProcess:   (options) => {

			return babel.transform(options.content, {
				presets: [
					[
						require.resolve('@babel/preset-env'), {
							modules: false,
							targets: {
								browsers: [
									'> 0.25%'
								]
							}
						}
					]
				],
				compact:       false,
				highlightCode: false,
				ast:           false,
				retainLines:   true
			}).code;
		}
	}))
	.pipe(uglify({ output: { comments: 'some' } }))
	.pipe(gulp.dest(`${paths.static}/scripts`))
;
