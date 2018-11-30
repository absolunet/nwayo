//-------------------------------------
//-- CLI
//-------------------------------------
'use strict';

const fs     = require('fs');
const helper = require('../helpers/cli');


//-- PUBLIC
module.exports = {

	//-- Arguments value
	argv: (argv, cwd) => {

		// make echos trappable in tests
		helper.echo = console.log;  // eslint-disable-line no-console
		// --

		const context = {
			command: argv[0] || '',
			target:  argv[1] || '',
			targets: argv.slice(1),
			cwd:     cwd || __dirname
		};

		const isFlag = context.command.substring(0, 2) === '--';

		// run command
		if (context.command !== 'index' && (isFlag || fs.existsSync(`${__dirname}/${context.command}.js`))) {

			// if project command
			if (['doctor', 'get', 'rebuild', 'run', 'watch', '--projecttasks'].indexOf(context.command) !== -1) {

				// get project package.json file
				if (fs.existsSync(`${context.cwd}/package.json`)) {
					context.pkg = require(`${context.cwd}/package`);  // eslint-disable-line global-require

					// check for nwayo config info
					if (!context.pkg.nwayo) {
						helper.error('No nwayo config found');
					}

				} else {
					helper.error('No package.json file found');
				}
			}

			if (isFlag) {

				if (context.command === '--tasks') {
					const files = fs.readdirSync(`${__dirname}`);
					const tasks = [];

					files.forEach((file) => {
						if (file !== 'index.js' && file.substring(0, 5) !== 'flag-') {
							tasks.push(file.substr(0, file.length - 7));
						}
					});

					return helper.echo(tasks.join('\n'));

				} else if (context.command === '--projecttasks') {
					return helper.run('--tasks-simple', context);

				} else if (context.command === '--projectbundles') {
					const files = fs.readdirSync(`${context.cwd}/bundles/`);
					const bundles = [];

					files.forEach((file) => {
						if (file.substr(-5, 5) === '.yaml') {
							bundles.push(file.substr(0, file.length - 5));
						}
					});

					return helper.echo(bundles.join('\n'));

				} else if (context.command === '--pronounce') {
					return require(`../tasks/flag-${context.command.substr(2)}`).run(context);  // eslint-disable-line global-require
				}

				return helper.usage();
			}

			return require(`../tasks/${context.command}`).run(context);  // eslint-disable-line global-require
		}

		return helper.usage();
	}
};
