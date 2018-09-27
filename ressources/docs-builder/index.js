//--------------------------------------------------------
//-- Docs builder
//--------------------------------------------------------
'use strict';

const babel         = require('babel-core');
const gulp          = require('gulp');
const cssnano       = require('gulp-cssnano');
const gulpsass      = require('gulp-dart-sass');
const uglify        = require('gulp-uglify');
const jsrender      = require('jsrender');
const MarkdownIt    = require('markdown-it');
const anchor        = require('markdown-it-anchor');
const externalLinks = require('markdown-it-external-links');
const minimist      = require('minimist');
const scandirectory = require('scandirectory');
const fss           = require('@absolunet/fss');
const include       = require('@absolunet/gulp-include');


const { task, local } = minimist(process.argv.slice(2));


const paths      = {};
paths.root       = fss.realpath(`${__dirname}/../..`);
paths.docs       = `${paths.root}/docs-sources`;
paths.ressources = `${paths.root}/ressources`;
paths.builder    = `${paths.ressources}/docs-builder`;
paths.out        = local ? `/tmp/ghpages-nwayo/nwayo` : `${paths.root}/docs`;
paths.static     = `${paths.out}/static`;
paths.workflow   = `${paths.root}/workflow`;

const ROOT   = '/nwayo';
const GITHUB = 'https://github.com/absolunet/nwayo';


const rename = (file) => {
	return `${file.replace('readme.md', 'index.html').replace('.md', '.html')}`;
};

const parseTitle = (str) => {
	return (str.split('\n').shift().match(/^# ([^[]+)/) || ['', 'Untitled'])[1];
};

const isBeingWritten = (str) => {
	return (/> Being written/).test(str);
};

const processNav = (tree, path = ROOT) => {
	const data = {};

	Object.keys(tree).forEach((page) => {
		const name    = rename(page).replace('.html', '');
		const content = tree[page];
		const url     = `${path}/${name}`;

		if (!isBeingWritten(content) && !isBeingWritten(content['readme.md'])) {
			if (typeof content === 'string') {
				if (page !== 'readme.md') {
					data[name] = {
						url:   url,
						title: parseTitle(content)
					};
				}
			} else {
				data[name] = {
					url:   url,
					title: parseTitle(content['readme.md'])
				};

				if (Object.keys(content).length > 1) {
					data[name]._children = processNav(content, url);
				}
			}
		}

	});

	return data;
};






//-- Tasks
switch (task) {

	//-- Build
	case 'build': {

		//-- Cleanup
		fss.remove(paths.out);
		fss.ensureDir(paths.out);
		fss.copy(`${paths.builder}/readme.md`, `${paths.out}/readme.md`);


		//-- Templates
		const tmpl = {};
		fss.readdir(`${paths.builder}/tmpl`).forEach((filename) => {
			const [file] = filename.split('.');
			tmpl[file] = jsrender.templates(file, fss.readFile(`${paths.builder}/tmpl/${filename}`, 'utf8'));
		});

		//-- Images
		const images = {};
		fss.readdir(`${paths.builder}/images`).forEach((filename) => {
			const [file] = filename.split('.');
			images[file] = fss.readFile(`${paths.builder}/images/${filename}`, 'utf8');
		});


		//-- Pages
		scandirectory(paths.docs, { readFiles:true }, (err, list, tree) => {
			if (!err) {

				const mainReadme = fss.readFile(`${paths.root}/readme.md`, 'utf8');
				list['readme.md'] = mainReadme;
				tree['readme.md'] = mainReadme;

				//-- Build nav
				const nav = processNav(tree);


				//-- Convert md to html
				const { version } = require(`${paths.workflow}/package`);  // eslint-disable-line global-require
				const year        = new Date().getFullYear();

				const md = new MarkdownIt();
				md.normalizeLink = (link) => {
					if ((/^(http|\/)/).test(link)) {
						return link;
					}

					return link
						.replace(/(.md)$/, '')
						.replace(/^(\.\.\/\.\.\/ressources\/images)/, `${ROOT}/static/images/`)
					;
				};

				md.use(anchor, {
					level:           2,
					permalink:       true,
					permalinkClass:  'anchor',
					permalinkSymbol: '⚭',
					permalinkBefore: true
				});

				md.use(externalLinks, {
					externalClassName: 'external',
					externalRel:       'external'
				});

				Object.keys(list).forEach((file) => {
					let content = list[file];
					let title = '';

					// Exceptions for main readme
					if (file === 'readme.md') {
						md.set({ html:true });
						content = content
							.replace(/\]\(docs-sources\//g, `](${ROOT}/`)
							.replace(/\]\(boilerplate\)/g, `](${GITHUB}/tree/master/boilerplate)`)
							.replace(/https:\/\/github.com\/absolunet\/nwayo\/raw\/master\/ressources\/images\//g, `${ROOT}/static/images/`)
							.replace(/nwayo\.png/g, `nwayo.svg`)
							.replace(/\[\/\/\]: # \(Doc\)([\s\S]*?)\[\/\/\]: # \(\/Doc\)/g, '')
						;

						title = `nwayo ${version} - Documentation`;

					} else {
						md.set({ html:false });
						title = `${parseTitle(content)} - nwayo`;
					}



					if (content !== 'dir' && !isBeingWritten(content)) {
						const outFile   = `${paths.out}/${rename(file)}`;
						const canonical = `${ROOT}/${rename(file).replace('/index.html', '').replace('.html', '')}`.replace('/index', '');

						fss.ensureFile(outFile);

						fss.writeFile(outFile, tmpl.layout.render({
							path: {
								'root':      ROOT,
								'static':    `${ROOT}/static`,
								'canonical': canonical,
								'github':    GITHUB,
								'source':    `${GITHUB}/blob/master/docs-sources/${file}`
							},
							images:  images,
							version: version,
							year:    year,
							nav:     { _children:nav },

							title:   title,
							content: md.render(content)
						}));
					}
				});
			} else {
				throw err;
			}
		});


		//-- Build static assets
		fss.ensureDir(paths.static);
		fss.copy(`${paths.ressources}/images`, `${paths.static}/images`);
		fss.copy(`${paths.root}/test/fixtures/build/icons/site`, `${paths.static}/icons`);

		// SCSS
		gulp.src(`${paths.builder}/styles/main.scss`)
			.pipe(gulpsass.sync({
				includePaths: [paths.builder],
				functions:    require(`${paths.workflow}/ressources/dart-sass-functions.js`)  // eslint-disable-line global-require
			})
				.on('error', gulpsass.logError))

			.pipe(cssnano({ reduceIdents:false, zindex:false }))
			.pipe(gulp.dest(`${paths.static}/styles`))
		;

		// JS
		gulp.src(`${paths.builder}/scripts/main.js`)
			.pipe(include({
				basePath:      paths.builder,
				autoExtension: true,
				partialPrefix: true,
				fileProcess:   (options) => {

					return babel.transform(options.content, {
						presets: [
							[
								require.resolve('babel-preset-env'), {
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
			.pipe(uglify({ output:{ comments:'some' } }))
			.pipe(gulp.dest(`${paths.static}/scripts`))
		;

		break;
	}

	default: break;

}
