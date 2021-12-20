//-------------------------------------
//-- Utils
//-------------------------------------
'use strict';

// const debug   = require('gulp-debug');
const boxen        = require('boxen');
const chalk        = require('chalk');
const crypto       = require('crypto');
const events       = require('events');
const glob         = require('glob');
const multiDest    = require('gulp-multi-dest');
const cloneDeep    = require('lodash.clonedeep');
const path         = require('path');
const requireDir   = require('require-dir');
const semver       = require('semver');
const slash        = require('slash');
const cli          = require('@absolunet/cli');
const fss          = require('@absolunet/fss');
const { terminal } = require('@absolunet/terminal');
const env          = require('./env');
const paths        = require('./paths');
const toolbox      = require('./toolbox');


const __ = {
	cache: {}
};


//-- Escape for regex usage
const escapeForRegex = (string) => {
	return string.replace(/[/\\^$*+?.()|[\]{}]/ug, '\\$&');
};


//-- Compare value with current cache if different
const cache = (key, value, process) => {
	const digest = crypto.createHash('sha1').update(value).digest('hex');
	let finalValue;

	if (!__.cache[key] || (__.cache[key] && __.cache[key].digest !== digest)) {
		finalValue = process(value);
		__.cache[key] = { digest, content: finalValue };
	} else {
		finalValue = __.cache[key].content;
	}

	return finalValue;
};






class Util {

	//-- Constants
	parseKonstan(type, bundle, { url: rootUrl, build: buildRoot }) {
		const parseItem = (item) => { return `data['${item.split('.').join(`']['`)}']`; }; // eslint-disable-line unicorn/consistent-function-scoping
		const options = cloneDeep(env.konstan.options[type]) || {};
		const urls    = cloneDeep(paths.build);
		const data    = cloneDeep(env.konstan.data);

		// Retrieve bundles
		data.bundles = cloneDeep(env.konstan.bundles);

		// Output url paths
		data.path = { root: rootUrl };

		if (type === 'styles') {
			options.escape = options.escape || [];
			options.escape.push('path.root');
			options.escape.push('util.emptyimage');
			urls.inline = paths.directory.cacheInline;
			urls.buildroot = slash(fss.realpath(`${paths.directory.root}/${buildRoot}`));
		}

		for (const key of Object.keys(urls)) {
			data.path[key] = (!['inline', 'buildroot'].includes(key) ? `${data.path.root}/` : '') + urls[key];

			if (options.escape && options.escape.includes('path.root')) {
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


	//-- Constants
	getKonstan(bundle) {
		return this.parseKonstan('scripts', bundle, env.bundles[bundle].output);
	}


	//-- Parse Lodash config
	parseLodash() {
		const config = fss.readYaml(paths.config.lodash);
		let cliParameters = '';

		for (const option of Object.keys(config)) {
			if (config[option].length !== 0) {
				cliParameters += ` ${option}=${config[option].join(',')}`;
			}
		}

		return cliParameters;
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

		return new RegExp(paths.pattern.babel.replace('##includes##', includes), 'u');
	}


	//-- Babel processing
	babelProcess(options, targets, allowed) {
		// Babel is really heavy on load
		const babel = require('@babel/core');  // eslint-disable-line global-require

		const { fullPath, rawPath } = options;
		let { content } = options;
		if (fullPath.slice(-3) === '.js') {
			if (!allowed.test(rawPath)) {
				const targetsDigest = crypto.createHash('sha1').update(JSON.stringify(targets)).digest('hex');
				content = cache(`babel:${fullPath}:${targetsDigest}`, content, (data) => {

					return babel.transform(data, {
						presets: [
							[
								paths.config.babelPreset, {
									modules: false,
									targets: { browsers: targets }
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
		// gulp.js is really heavy on load
		const gulp = require('gulp');   // eslint-disable-line global-require

		const streams = [];
		for (const component of env.bundlesComponents) {

			// Check if component has assets
			const componentFiles = files.replace(paths.pattern.anytree, component);
			if (glob.sync(componentFiles).length !== 0) {

				// Create stream for component
				let componentStream = gulp.src(componentFiles, { base: paths.directory.root });
				componentStream = customPiping(componentStream);

				// Output to each bundle
				const outputs = [];
				for (const name of Object.keys(env.bundles)) {
					const bundle = env.bundles[name];

					if (bundle.assets.components.includes(component)) {
						outputs.push(`${paths.directory.root}/${bundle.output.build}`);
					}
				}
				componentStream.pipe(multiDest(outputs));

				streams.push(componentStream);
			}
		}

		return streams.length !== 0 ? toolbox.mergeStreams(streams) : toolbox.vinylStream('empty-stream', '');
	}


	//-- Generation banner in build
	getGeneratedBanner(name, type, extension) {
		const banner = `Generated by ${env.id} ${env.workflowConfig.version} ${extension ? `/ ${extension.id} ${extension.version} ` : ''}for ${env.packageConfig.name}:${name}`;

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
		return `${env.bundles[bundle].output.url}/${paths.build.scripts}${collection ? `/${collection}.${paths.extension.scripts}` : ''}`;
	}

	getStylesUrl(bundle, collection) {
		return `${env.bundles[bundle].output.url}/${paths.build.styles}${collection ? `/${collection}.${paths.extension.stylesBuild}` : ''}`;
	}






	//-- Check if installed workflow is up to date
	checkInstalledWorkflow() {

		// Check for asked version vs installed version
		const requiredVersion  = env.packageConfig.dependencies[env.packageName];
		const installedVersion = env.workflowConfig.version;

		if (semver.gt(requiredVersion, installedVersion)) {

			terminal.echo(boxen(
				`Workflow update available ${chalk.dim(installedVersion)} ${chalk.reset('→')} ${chalk.green(requiredVersion)}

The required version in your project's package.json
is greater than the installed one

Run ${chalk.cyan('npm install')} to update`,
				{
					padding:     1,
					margin:      0.5,
					align:       'center',
					borderColor: 'yellow'
				}
			)).exit();
		}
	}


	//-- Run workflow task
	runWorkflowTask(task, { bundle }) {
		let taskFile;
		let extension;
		const [, extensionName, taskName] = (/^(?<alpha1>[a-z-]+):(?<alpha2>[a-z-]+)$/u).exec(task) || [];

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
			require(taskFile)();
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


	//-- Load all tasks
	loadAllTasks() {
		const tasks = requireDir(paths.workflow.tasks, {
			filter: (taskPath) => {
				return !['rebuild', 'watch'].includes(path.basename(taskPath, '.js'));
			}
		});

		Object.values(tasks).forEach((task) => {
			task();
		});
	}


	//-- Init CLI
	initCli(globalUsage) {
		terminal.setTheme({
			logo: env.logo
		});

		cli.init({
			pkg: { name: env.id, bin: { [env.id]: '' } }  // eslint-disable-line unicorn/prevent-abbreviations
		});

		cli.initTasksList(paths.workflow.cliTasks);



		const tasks = ['assets', 'icons', 'local', 'scripts', 'styles'];

		/* eslint-disable quote-props */
		cli.setUsageTasks(Object.assign(
			{},
			{
				'run':     [`run ${cli.placeholder('<task>')} ${cli.optionalPlaceholder('<bundle>')}`, `Run a task ex:[${tasks.join('|')}]`, [tasks]],
				'rebuild': [`rebuild ${cli.optionalPlaceholder('<bundle>')} ${cli.optional('--prod')}`, `Rebuild the entire project from scratch`],
				'watch':   [`watch ${cli.optionalPlaceholder('<bundle>')}`, `Listens for changes on files and run appropriate tasks`]
			},
			globalUsage.tasks
		));

		cli.setFullUsage(Object.assign(
			{},
			{ 'Project': ['run', 'rebuild', 'watch'] },
			globalUsage.full
		), { showBin: false });
		/* eslint-enable quote-props */
	}

}


module.exports = new Util();
