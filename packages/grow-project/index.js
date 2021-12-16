//--------------------------------------------------------
//-- Grow project
//--------------------------------------------------------
'use strict';

const chalk         = require('chalk');
const figures       = require('figures');
const inquirer      = require('inquirer');
const replaceInFile = require('replace-in-file');
const fss           = require('@absolunet/fss');


const LOCAL           = fss.realpath('.');
const NWAYO           = `${LOCAL}/nwayo`;
const CONFIG_ORIGINAL = `${NWAYO}/nwayo.yaml`;
const BUNDLE          = `${NWAYO}/bundles/site/site.yaml`;
const CONFIG          = `${LOCAL}/nwayo.yaml`;

const ROOT        = fss.realpath(`${__dirname}`);
const BOILERPLATE = `${ROOT}/boilerplate`;
const PACKAGE     = fss.readJson(`${ROOT}/package.json`);

const echo = console.log;  // eslint-disable-line no-console

const error = (message) => {
	console.error(chalk.red(`\n  ${figures.cross} ${message}`));  // eslint-disable-line no-console
	process.exit();  // eslint-disable-line no-process-exit, unicorn/no-process-exit
};






class GrowProject {

	async cli() {

		if (fss.exists(NWAYO)) {
			error(`There is already a 'nwayo' folder`);
		}

		if (fss.exists(CONFIG)) {
			error(`There is already a 'nwayo.yaml' file`);
		}

		const { projectId } = await inquirer.prompt([{
			name:     'projectId',
			message:  `What is your project's id ?`,
			type:     'input',
			validate: (id) => {
				if (id.length >= 3) {
					if ((/^(?<kebab1>[a-z][a-z0-9]*)(?<kebab2>-[a-z0-9]+)*$/u).test(id)) {
						return true;
					}

					return 'The project id must be kebab-case';
				}

				return 'The project id must be at least 3 characters long';
			}
		}]);


		echo(chalk.blue(`\n${figures.play} Generating project ${figures.ellipsis}`));

		// Duplicate boilerplate
		fss.copy(BOILERPLATE, NWAYO);
		fss.rename(`${NWAYO}/-gitignore`, `${NWAYO}/.gitignore`);

		// Configuration
		const config = fss.readYaml(CONFIG_ORIGINAL);
		config.root = 'nwayo';
		fss.writeYaml(CONFIG, config);
		fss.remove(CONFIG_ORIGINAL);

		// Bundle
		const bundle = fss.readYaml(BUNDLE);
		bundle.output.konstan = '../pub/build';
		bundle.output.build =   '../pub/build';
		fss.writeYaml(BUNDLE, bundle);

		// Change project name
		await replaceInFile({
			files: [
				`${NWAYO}/package.json`,
				`${NWAYO}/vendor/package.json`
			],
			from: 'PROJECT_NAME',
			to:   projectId
		});

		// Confirmation
		echo(`
${chalk.green(`${figures.tick} ${chalk.bold(projectId)} via nwayo ${PACKAGE.version} created!`)}


  1. If not already present, install nwayo CLI via ${chalk.yellow('npm i -g @absolunet/nwayo-cli')}
  2. Run ${chalk.yellow('npm install')} in the nwayo root folder
  3. Run ${chalk.yellow('npm install')} in the vendor folder
  4. Run ${chalk.yellow('nwayo rebuild')} in the nwayo root folder
  5. Enjoy !
		`);
	}

}


module.exports = new GrowProject();
