# nwayo analyze <name>

module.exports = (app) ->
	echo = console.log

	analyze = (module) ->
		chalk = require 'chalk'

		switch module

			# nwayo analyze node
			when 'node'
				david = require 'david'

				echo ''
				echo "   Analyzing #{app.projpkg.name.cyan} node dependencies"
				echo ''
				david.getUpdatedDependencies app.projpkg, dev:true, (er, deps) ->

					if Object.keys(deps).length
						echo chalk.bgRed '                               '
						echo chalk.bgRed '  You are a dull blade   ಠ_ಠ   '
						echo chalk.bgRed '                               '
						echo ''
						echo "[#{name}] : #{chalk.red version.required} ➝  #{chalk.green version.stable}" for name, version of deps
						echo ''

					else
						echo chalk.green '   You are cutting edge - Have a cat '
						echo '   '+''
						echo '   '+'             .               ,.                           '
						echo '   '+'            T."-._..---.._,-"/|                           '
						echo '   '+'            l|"-.  _.v._   (" |                           '
						echo '   '+'            [l /.\'_ \\; _~"-.`-t                           '
						echo '   '+'            Y " _(o} _{o)._ ^.|                           '
						echo '   '+'            j  T  ,-<v>-.  T  ]                           '
						echo '   '+'            \\  l ( /-^-\\ ) !  !                           '
						echo '   '+'             \\. \\.  "~"  ./  /c-..,__                     '
						echo '   '+'               ^r- .._ .- .-"  `- .  ~"--.                '
						echo '   '+'                > \\.                      \\               '
						echo '   '+'                ]   ^.                     \\              '
						echo '   '+'                3  .  ">            .       Y             '
						echo '   '+'   ,.__.--._   _j   \\ ~   .         ;       |             '
						echo '   '+'  (    ~"-._~"^._\\   ^.    ^._      I     . l             '
						echo '   '+'   "-._ ___ ~"-,_7    .Z-._   7"   Y      ;  \\        _   '
						echo '   '+'      /"   "~-(r r  _/_--._~-/    /      /,.--^-._   / Y  '
						echo '   '+'      "-._    \'"~~~>-._~]>--^---./____,.^~        ^.^  !  '
						echo '   '+'          ~--._    \'   Y---.                        \\./   '
						echo '   '+'               ~~--._  l_   )                        \\    '
						echo '   '+'                     ~-._~~~---._,____..---           \\   '
						echo '   '+'                         ~----"~       \\                  '
						echo '   '+'                                        \\                 '
						echo '   '+'                                                          '


			# nwayo analyze bower
			when 'bower'
				bower = require 'bower'

				echo ''
				echo "   Analyzing #{chalk.cyan app.projpkg.name} bower dependencies"
				echo ''
				bower.commands.list().on 'end', (data) ->

					found = false
					for name, info of data.dependencies
						if info.update && info.pkgMeta.version != info.update.latest
							if not found
								found = true
								echo chalk.bgRed '                               '
								echo chalk.bgRed '  You are a dull blade   ಠ_ಠ   '
								echo chalk.bgRed '                               '
								echo ''

							echo "[#{name}] : #{chalk.red info.pkgMeta.version} ➝  #{chalk.green info.update.latest}"

					if not found
						echo chalk.green '   You are cutting edge - Have a bird '
						echo ''
						echo '   '+'                                          '
						echo '   '+'                _.----._                  '
						echo '   '+'              ,\'.::.--..:._               '
						echo '   '+'             //:://_,-<o)::;_`-._         '
						echo '   '+'            ::::::::`-\';\'`,--`-`          '
						echo '   '+'            ;::;\'|::::,\',\'                '
						echo '   '+'          ,\':://  ;::://, :.              '
						echo '   '+'         //,\'://  //::;\' \ \':\              '
						echo '   '+'        :\'.:: ,-\'\'   . `.::\               '
						echo '   '+'        \.:;\':.    `    :: .:              '
						echo '   '+'        (;\' ;;;       .::\' :|             '
						echo '   '+'         \,:;;      \ `::.\.\                 '
						echo '   '+'         `);\'        \'::\'  `:             '
						echo '   '+'          \.  `        `\'  .:      _ ,\'    '
						echo '   '+'           `.: ..  -. \' :. ://  _.-\' _.-  '
						echo '   '+'             >;._.:._.;,-=_(.-\'  __ `._   '
						echo '   '+'           ,;\'  _..-((((\'\'  .,-\'\'  `-._   '
						echo '   '+'        _,\'<.-\'\'  _..``\'.\'`-\'`.        `  '
						echo '   '+'    _.-((((_..--\'\'       \ \ `.`.           '
						echo '   '+'  -\'  _.``\'               \      `         '
						echo '   '+'    ,\'                                    '
						echo '   '+'                                          '

					echo ''

			else app.usage()



	# cli
	if app.projconf

		if app.target?
			analyze app.target
		else

			inquirer = require 'inquirer'

			echo ''
			inquirer.prompt [{
				name:    'system'
				message: 'What do you want to analyze?'
				type:    'list'
				choices: [
					{ name:'Node modules dependencies status', value:'node' }
					{ name:'Bower packages dependencies status', value:'bower' }
				]
			}], (data) -> analyze data.system

	else app.noproject()
