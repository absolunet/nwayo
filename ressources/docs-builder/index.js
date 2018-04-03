//--------------------------------------------------------
//-- Docs builder
//--------------------------------------------------------
'use strict';

const babel         = require('babel-core');
const ghpages       = require('gh-pages');
const gulp          = require('gulp');
const cssnano       = require('gulp-cssnano');
const sass          = require('gulp-ruby-sass');
const uglify        = require('gulp-uglify');
const inquirer      = require('inquirer');
const jsrender      = require('jsrender');
const MarkdownIt    = require('markdown-it');
const minimist      = require('minimist');
const scandirectory = require('scandirectory');
const fss           = require('@absolunet/fss');
const include       = require('@absolunet/gulp-include');

// Temp wrappers
fss.ensureFile = require('fs-extra').ensureFileSync;


const paths      = {};
paths.root       = fss.realpath(`${__dirname}/../..`);
paths.docs       = `${paths.root}/docs`;
paths.ressources = `${paths.root}/ressources`;
paths.builder    = `${paths.ressources}/docs-builder`;
paths.out        = `${paths.root}/test/fixtures/docs/nwayo`;
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
const { task } = minimist(process.argv.slice(2));
switch (task) {

	//-- Build
	case 'build': {

		//-- Cleanup
		fss.del(paths.out, { force:true });
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
					if (/^(http|\/)/.test(link)) {
						return link;
					}

					return link
						.replace(/(.md)$/, '')
						.replace(/^(\.\.\/\.\.\/ressources\/images)/, `${ROOT}/static/images/`)
					;
				};

				Object.keys(list).forEach((file) => {
					let content = list[file];
					let title = '';

					// Exceptions for main readme
					if (file === 'readme.md') {
						md.set({ html:true });
						content = content
							.replace(/\]\(docs\//g, `](${ROOT}/`)
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
								'source':    `${GITHUB}/blob/master/docs/${file}`
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
		sass(`${paths.builder}/styles/main.scss`, {
			loadPath:      paths.builder,
			cacheLocation: '/tmp',
			require:       `${paths.workflow}/sass.rb`
		})
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
											'> 1%',
											'last 2 versions',
											'not ie < 11'
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


	//-- Publish
	case 'publish': {

		inquirer.prompt([
			{
				name:    'message',
				message: 'Commit message:'
			}
		]).then(({ message }) => {

			ghpages.publish(paths.out, {
				branch: 'gh-pages',
				repo:   'git@github.com:absolunet/nwayo.git',
				message: message
			});

		});

		break;
	}

	default: break;

}
