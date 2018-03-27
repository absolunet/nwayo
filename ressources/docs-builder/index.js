//--------------------------------------------------------
//-- Docs builder
//--------------------------------------------------------
'use strict';

const cssnano    = require('gulp-cssnano');
const ghpages    = require('gh-pages');
const gulp       = require('gulp');
const inquirer   = require('inquirer');
const jsrender   = require('jsrender');
const MarkdownIt = require('markdown-it');
const minimist   = require('minimist');
const sass       = require('gulp-ruby-sass');
const fss        = require('@absolunet/fss');

// Temp wrappers
fss.readdirRecursive = require('fs-readdir-recursive');
fss.ensureFile       = require('fs-extra').ensureFileSync;


const paths      = {};
paths.root       = fss.realpath(`${__dirname}/../..`);
paths.docs       = `${paths.root}/docs`;
paths.ressources = `${paths.root}/ressources`;
paths.builder    = `${paths.ressources}/docs-builder`;
paths.out        = `${paths.root}/test/fixtures/docs/nwayo`;
paths.static     = `${paths.out}/static`;


const getTmpl = (file) => {
	return jsrender.templates(fss.readFile(`${paths.builder}/tmpl/${file}.jshtml`, 'utf8'));
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
			layout: getTmpl('layout')
		};

		//-- Convert md to html
		const md = new MarkdownIt();
		md.normalizeLink = (link) => {
			if (/^(http|\/)/.test(link)) {
				return link;
			}

			return link
				.replace(/(.md)$/, '')
				.replace('../../ressources/images/', '/nwayo/static/images/')
			;
		};

		fss.readdirRecursive(paths.docs).forEach((file) => {
			const source  = fss.readFile(`${paths.docs}/${file}`, 'utf8');
			const outFile = `${paths.out}/${file.replace('readme.md', 'index.html').replace('.md', '.html')}`;

			fss.ensureFile(outFile);

			fss.writeFile(outFile, tmpl.layout.render({
				content: md.render(source),
				version: 'x.x.x',
				year:    new Date().getFullYear()
			}));
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
