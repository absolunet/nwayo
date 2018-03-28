//--------------------------------------------------------
//-- Docs builder
//--------------------------------------------------------
'use strict';

const ghpages       = require('gh-pages');
const gulp          = require('gulp');
const cssnano       = require('gulp-cssnano');
const sass          = require('gulp-ruby-sass');
const inquirer      = require('inquirer');
const jsrender      = require('jsrender');
const MarkdownIt    = require('markdown-it');
const minimist      = require('minimist');
const scandirectory = require('scandirectory');
const fss           = require('@absolunet/fss');

// Temp wrappers
fss.ensureFile = require('fs-extra').ensureFileSync;


const paths      = {};
paths.root       = fss.realpath(`${__dirname}/../..`);
paths.docs       = `${paths.root}/docs`;
paths.ressources = `${paths.root}/ressources`;
paths.builder    = `${paths.ressources}/docs-builder`;
paths.out        = `${paths.root}/test/fixtures/docs/nwayo`;
paths.static     = `${paths.out}/static`;

const ROOT = '/nwayo';


const getTmpl = (file) => {
	return jsrender.templates(file, fss.readFile(`${paths.builder}/tmpl/${file}.jshtml`, 'utf8'));
};

const rename = (file) => {
	return `${file.replace('readme.md', 'index.html').replace('.md', '.html')}`;
};

const parseTitle = (str) => {
	return str.split('\n').shift().match(/^# ([^[]+)/)[1];
};

const processNav = (tree, path = ROOT) => {
	const data = {};

	Object.keys(tree).forEach((page) => {
		const name    = rename(page).replace('.html', '');
		const content = tree[page];
		const url     = `${path}/${name}`;

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
		const tmpl = {
			layout: getTmpl('layout'),
			nav:    getTmpl('nav')
		};

		//-- Pages
		scandirectory(paths.docs, { readFiles:true }, (err, list, tree) => {
			if (!err) {

				//-- Build nav
				const nav = processNav(tree);


				//-- Convert md to html
				const md = new MarkdownIt();
				md.normalizeLink = (link) => {
					if (/^(http|\/)/.test(link)) {
						return link;
					}

					return link
						.replace(/(.md)$/, '')
						.replace('../../ressources/images/', `${ROOT}/static/images/`)
					;
				};

				Object.keys(list).forEach((file) => {
					const content = list[file];

					if (content !== 'dir') {
						const outFile   = `${paths.out}/${rename(file)}`;
						const canonical = `${ROOT}/${rename(file).replace('/index.html', '').replace('.html', '')}`;

						fss.ensureFile(outFile);

						fss.writeFile(outFile, tmpl.layout.render({
							path: {
								'root':   ROOT,
								'static': `${ROOT}/static`
							},
							version:   require(`${paths.root}/workflow/package`).version,  // eslint-disable-line global-require
							year:      new Date().getFullYear(),
							nav:       { _children:nav },

							canonical: canonical,
							title:     parseTitle(content),
							content:   md.render(content),
							source:    `https://github.com/absolunet/nwayo/blob/master/docs/${file}`
						}));
					}
				});
			}
		});


		//-- Build static assets
		fss.ensureDir(paths.static);
		fss.copy(`${paths.ressources}/images`, `${paths.static}/images`);

		// SCSS
		sass(`${paths.builder}/styles/main.scss`, {
			loadPath:      paths.builder,
			cacheLocation: '/tmp'
		})
			.pipe(cssnano({ reduceIdents:false, zindex:false }))
			.pipe(gulp.dest(`${paths.static}/styles`))
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
				branch: 'gh-pages-test',
				repo:   'git@github.com:absolunet/nwayo.git',
				message: message
			});

		});

		break;
	}

	default: break;

}
