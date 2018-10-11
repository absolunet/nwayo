//-------------------------------------
//-- Utils
//-------------------------------------
'use strict';

// const debug = require('gulp-debug');
const boxen     = require('boxen');
const chalk     = require('chalk');
const crypto    = require('crypto');
const events    = require('events');
const glob      = require('glob');
const multiDest = require('gulp-multi-dest');
const _         = require('lodash');
const path      = require('path');
const semver    = require('semver');
const cli       = require('@absolunet/cli');
const fss       = require('@absolunet/fss');
const terminal  = require('@absolunet/terminal');
const env       = require('~/helpers/env');
const paths     = require('~/helpers/paths');
const toolbox   = require('~/helpers/toolbox');


const __ = {
	cache: {}
};


//-- Escape for regex usage
const escapeForRegex = (string) => {
	return string.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
};


//-- Compare value with current cache if different
const cache = (key, value, process) => {
	const digest = crypto.createHash('sha1').update(value).digest('hex');
	let val;

	if (!__.cache[key] || (__.cache[key] && __.cache[key].digest !== digest)) {
		val = process(value);
		__.cache[key] = {
			digest:  digest,
			content: val
		};
	} else {
		val = __.cache[key].content;
	}

	return val;
};






class Util {

	//-- Constants
	parseKonstan(type, bundle, { url:rootUrl, build:buildRoot }) {
		const parseItem = (item) => { return `data['${item.split('.').join(`']['`)}']`; };
		const options   = _.cloneDeep(env.konstan.options[type]) || {};
		const urls      = _.cloneDeep(paths.build);
		const data      = _.cloneDeep(env.konstan.data);

		// Retrieve bundles
		data.bundles = _.cloneDeep(env.konstan.bundles);

		// Output url paths
		data.path = { root:rootUrl };

		if (type === 'styles') {
			options.escape = options.escape || [];
			options.escape.push('path.root');
			urls.inline = paths.dir.cacheInline;
			urls.buildroot = fss.realpath(`${paths.dir.root}/${buildRoot}`);
		}

		for (const key of Object.keys(urls)) {
			data.path[key] = (!['inline', 'buildroot'].includes(key) ? `${data.path.root}/` : '') + urls[key];

			if (options.escape && options.escape.indexOf('path.root') !== -1) {
				options.escape.push(`path.${key}`);
			}
		}

		// Option escape strings
		if (options.escape) {
			for (let item of options.escape) {
				item = parseItem(item);

				eval(`${item} = "'"+${item}.replace("'","\\\\\'")+"'"`); // eslint-disable-line no-eval, no-useless-escape
			}
		}

		// Option excluse items
		if (options.exclude) {
			for (let item of options.exclude) {
				item = parseItem(item);

				eval(`delete ${item}`); // eslint-disable-line no-eval
			}
		}

		return data;
	}


	//-- Parse Lodash config
	parseLodash() {
		const config = fss.readYaml(paths.config.lodash);
		let cliParams = '';

		for (const option of Object.keys(config)) {
			if (config[option].length !== 0) {
				cliParams += ` ${option}=${config[option].join(',')}`;
			}
		}

		return cliParams;
	}


	//-- Babel allowed rules
	getBabelAllowedRules(includedFiles) {
		let includes = '';
		if (Boolean(includedFiles) && includedFiles.length !== 0) {
			const includesLength = includedFiles.length - 1;
			includedFiles.forEach((file, i) => {
				includes += (i === 0 ? '(?!' : '|') + escapeForRegex(file) + (i === includesLength ? ')' : '');
			});
		}

		return new RegExp(paths.pattern.babel.replace('##includes##', includes));
	}


	//-- Babel processing
	babelProcess(options, targets, allowed) {
		const babel = require('babel-core');  // eslint-disable-line global-require, Babel is really heavy on load

		const { fullPath, rawPath } = options;
		let { content } = options;
		if (fullPath.substr(-3) === '.js') {
			if (!allowed.test(rawPath)) {
				const targetsDigest = crypto.createHash('sha1').update(JSON.stringify(targets)).digest('hex');
				content = cache(`babel:${fullPath}:${targetsDigest}`, content, (data) => {

					return babel.transform(data, {
						presets: [
							[
								paths.config.babelPresetEnv, {
									modules: false,
									targets: { browsers:targets }
								}
							]
						],
						compact:       false,
						highlightCode: false,
						ast:           false,
						retainLines:   true
					}).code;
				});
			}
		}

		return content;
	}


	//-- Assets rename
	assetsRename(filename) {
		return (pathname) => {
			const elements = pathname.dirname.split(path.sep);
			pathname.dirname = `${elements[3]}/${elements[1]}/${elements.slice(4).join('/')}`;

			if (typeof filename === 'string') {
				pathname.basename = filename;
			} else if (typeof filename === 'function') {
				pathname.basename = filename(pathname.basename);
			}

			return false;
		};
	}


	//-- Assets processing pattern
	assetsProcess(files, customPiping) {
		const gulp = require('gulp');   // eslint-disable-line global-require, gulp.js is really heavy on load

		const streams = [];
		for (const component of env.bundlesComponents) {

			// Check if component has assets
			const componentFiles = files.replace(paths.pattern.anytree, component);
			if (glob.sync(componentFiles).length !== 0) {

				// Create stream for component
				let componentStream = gulp.src(componentFiles, { base:paths.dir.root });
				componentStream = customPiping(componentStream);

				// Output to each bundle
				const outputs = [];
				for (const name of Object.keys(env.bundles)) {
					const bundle = env.bundles[name];

					if (_.includes(bundle.assets.components, component)) {
						outputs.push(`${paths.dir.root}/${bundle.output.build}`);
					}
				}
				componentStream.pipe(multiDest(outputs));

				streams.push(componentStream);
			}
		}

		return toolbox.mergeStreams(streams);
	}


	//-- Generation banner in build
	getGeneratedBanner(name, type, extension) {
		const banner = `Generated by ${env.id} ${env.workflowPkg.version} ${extension ? `/ ${extension.id} ${extension.version} ` : ''}for ${env.pkg.name}:${name}`;

		switch (type) {

			case 'text': return `${banner}`;
			default:     return `/*!\n * @preserve ${banner}\n */\n\n`;

		}
	}

	getFontsUrl(bundle, component) {
		return `${env.bundles[bundle].output.url}/${paths.build.fonts}${component ? `/${component}` : ''}`;
	}

	getIconsUrl(bundle, component) {
		return `${env.bundles[bundle].output.url}/${paths.build.icons}${component ? `/${component}` : ''}`;
	}

	getImagesUrl(bundle, component) {
		return `${env.bundles[bundle].output.url}/${paths.build.images}${component ? `/${component}` : ''}`;
	}

	getRawUrl(bundle, component) {
		return `${env.bundles[bundle].output.url}/${paths.build.raw}${component ? `/${component}` : ''}`;
	}

	getScriptsUrl(bundle, collection) {
		return `${env.bundles[bundle].output.url}/${paths.build.scripts}${collection ? `/${collection}.${paths.ext.scripts}` : ''}`;
	}

	getStylesUrl(bundle, collection) {
		return `${env.bundles[bundle].output.url}/${paths.build.styles}${collection ? `/${collection}.${paths.ext.stylesBuild}` : ''}`;
	}






	//-- Check if installed workflow is up to date
	checkInstalledWorkflow() {

		// Check for asked version vs installed version
		const requiredVersion  = env.pkg.dependencies[env.pkgName];
		const installedVersion = env.workflowPkg.version;

		if (semver.gt(requiredVersion, installedVersion)) {

			/* eslint-disable function-paren-newline */
			terminal.echo(boxen(
				`Workflow update available ${chalk.dim(installedVersion)} ${chalk.reset('→')} ${chalk.green(requiredVersion)}

The required version in your project's package.json
is greater than the installed one

Run ${chalk.cyan('nwayo install workflow')} to update`,
				{
					padding:     1,
					margin:      0.5,
					align:       'center',
					borderColor: 'yellow'
				}
			));
			/* eslint-enable function-paren-newline */

			terminal.exit();
		}
	}


	//-- Run workflow task
	runWorkflowTask(task, { bundle }) {
		let taskFile;
		let extension;
		const [, extensionName, taskName] = (/^([a-z\\-]+):([a-z\\-]+)$/).exec(task) || [];

		if (extensionName) {
			extension = env.extensions[extensionName];

			if (!env.extensions[extensionName]) {
				terminal.exit(`Extension ${chalk.underline(extensionName)} is not enabled`);
			}

			if (!env.extensions[extensionName].taskExists(taskName)) {
				terminal.exit(`Task ${chalk.underline(task)} does not exists`);
			}

		} else {
			const [group]  = task.split('-');
			taskFile = `${paths.workflow.tasks}/${group}`;
			if (!fss.exists(`${taskFile}.js`)) {
				terminal.exit(`Task ${chalk.underline(task)} does not exists`);
			}
		}

		//-- Boost max listeners
		events.EventEmitter.prototype._maxListeners = 100;

		//-- Init env
		env.initWorkflow({ bundle });


		//-- Load tasks
		/* eslint-disable global-require */
		process.stdout.write(`\n${env.logo}  Gathering intel... `);

		const gulp = require('gulp');  // gulp.js is really heavy on load

		if (extension) {
			extension.requireTask(taskName);
		} else {
			require(taskFile);
		}

		terminal.echo(chalk.green(`\r${env.logo}  Ready to roll  `));
		/* eslint-enable global-require */


		//-- Run task
		if (gulp.task(task)) {
			terminal.spacer();
			gulp.series(task)();
		} else {
			terminal.exit(`Task ${chalk.underline(task)} does not exists`);
		}
	}


	//-- Init CLI
	initCli() {
		terminal.setDefault({
			logo:   env.logo,
			color: 'cyan',
			lang:  'en'
		});

		cli.init({
			pkg: { name:env.id, bin:{ [env.id]:'' } }
		});

		cli.initTasksList(paths.workflow.cliTasks);



		const tasks         = ['assets', 'icons', 'local', 'scripts', 'styles'];
		const installScopes = ['workflow', 'vendors'];

		/* eslint-disable quote-props */
		cli.setUsageTasks({

			// Project
			'run':     [`run ${cli.placeholder('<task>')} ${cli.optionalPlaceholder('<bundle>')}`, `Run a task ex:[${tasks.join('|')}]`, [tasks]],
			'rebuild': [`rebuild ${cli.optionalPlaceholder('<bundle>')} ${cli.optional('--prod')}`, `Rebuild the entire project from scratch`],
			'watch':   [`watch ${cli.optionalPlaceholder('<bundle>')}`, `Listens for changes on files and run appropriate tasks`],
			'install': [`install ${cli.optionalPlaceholder('<scope>')} ${cli.optional('--force')}`, `Install dependencies ex:[${installScopes.join('|')}]`, [installScopes]],
			'doctor':  [`doctor ${cli.optional('--verbose')}`, `Analyze project for conformity`, [tasks]],

			// Options
			'update':      [`update`, `Update the CLI`],
			'outdated':    [`outdated`, `Check if CLI is outdated`],
			'--help':      [`-h, --help`, `Show help`],
			'--version':   [`-v, --version`, 'Show CLI version'],
			'--pronounce': [`--pronounce`, `Listen to ${env.id} pronunciation`]

		});

		cli.setFullUsage({
			'Project': ['run', 'rebuild', 'watch', 'install', 'doctor'],
			'CLI': ['update', 'outdated', '--help', '--version', '--pronounce']
		}, { showBin:false });
		/* eslint-enable quote-props */
	}

}


module.exports = new Util();
