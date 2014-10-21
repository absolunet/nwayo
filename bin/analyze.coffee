# nwayo analyze <name>

module.exports = (app) ->
	colors = require 'colors'
	echo   = console.log

	if app.projconf

		switch app.target

			# nwayo analyze node
			when 'node'
				david = require 'david'

				echo ''
				echo "   Analyzing #{app.projpkg.name.cyan} node dependencies"
				echo ''
				david.getUpdatedDependencies app.projpkg, dev:true, (er, deps) ->

					if Object.keys(deps).length
						echo '                               '.bgRed
						echo '  You are a dull blade   ಠ_ಠ   '.bgRed
						echo '                               '.bgRed
						echo ''
						echo "[#{name}] : #{version.required.red} ➝  #{version.stable.green}" for name, version of deps
						echo ''

					else
						echo '   You are cutting edge - Have a cat '.green
						echo '   '+''
						echo '   '+'             .               ,.                           '.inverse
						echo '   '+'            T."-._..---.._,-"/|                           '.inverse
						echo '   '+'            l|"-.  _.v._   (" |                           '.inverse
						echo '   '+'            [l /.\'_ \\; _~"-.`-t                           '.inverse
						echo '   '+'            Y " _(o} _{o)._ ^.|                           '.inverse
						echo '   '+'            j  T  ,-<v>-.  T  ]                           '.inverse
						echo '   '+'            \\  l ( /-^-\\ ) !  !                           '.inverse
						echo '   '+'             \\. \\.  "~"  ./  /c-..,__                     '.inverse
						echo '   '+'               ^r- .._ .- .-"  `- .  ~"--.                '.inverse
						echo '   '+'                > \\.                      \\               '.inverse
						echo '   '+'                ]   ^.                     \\              '.inverse
						echo '   '+'                3  .  ">            .       Y             '.inverse
						echo '   '+'   ,.__.--._   _j   \\ ~   .         ;       |             '.inverse
						echo '   '+'  (    ~"-._~"^._\\   ^.    ^._      I     . l             '.inverse
						echo '   '+'   "-._ ___ ~"-,_7    .Z-._   7"   Y      ;  \\        _   '.inverse
						echo '   '+'      /"   "~-(r r  _/_--._~-/    /      /,.--^-._   / Y  '.inverse
						echo '   '+'      "-._    \'"~~~>-._~]>--^---./____,.^~        ^.^  !  '.inverse
						echo '   '+'          ~--._    \'   Y---.                        \\./   '.inverse
						echo '   '+'               ~~--._  l_   )                        \\    '.inverse
						echo '   '+'                     ~-._~~~---._,____..---           \\   '.inverse
						echo '   '+'                         ~----"~       \\                  '.inverse
						echo '   '+'                                        \\                 '.inverse
						echo '   '+'                                                          '.inverse


			# nwayo analyze bower
			when 'bower'
				bower = require 'bower'

				echo ''
				echo "   Analyzing #{app.projpkg.name.cyan} bower dependencies"
				echo ''
				bower.commands.list().on 'end', (data) ->

					found = false
					for name, info of data.dependencies
						if info.update && info.pkgMeta.version != info.update.latest
							if not found
								found = true
								echo '                               '.bgRed
								echo '  You are a dull blade   ಠ_ಠ   '.bgRed
								echo '                               '.bgRed
								echo ''

							echo "[#{name}] : #{info.pkgMeta.version.red} ➝  #{info.update.latest.green}"

					if not found
						echo '   You are cutting edge - Have a bird '.green
						echo '   '+''
						echo '   '+'                                          '.inverse
						echo '   '+'                _.----._                  '.inverse
						echo '   '+'              ,\'.::.--..:._               '.inverse
						echo '   '+'             //:://_,-<o)::;_`-._         '.inverse
						echo '   '+'            ::::::::`-\';\'`,--`-`          '.inverse
						echo '   '+'            ;::;\'|::::,\',\'                '.inverse
						echo '   '+'          ,\':://  ;::://, :.              '.inverse
						echo '   '+'         //,\'://  //::;\' \ \':\              '.inverse
						echo '   '+'        :\'.:: ,-\'\'   . `.::\               '.inverse
						echo '   '+'        \.:;\':.    `    :: .:              '.inverse
						echo '   '+'        (;\' ;;;       .::\' :|             '.inverse
						echo '   '+'         \,:;;      \ `::.\.\                 '.inverse
						echo '   '+'         `);\'        \'::\'  `:             '.inverse
						echo '   '+'          \.  `        `\'  .:      _ ,\'    '.inverse
						echo '   '+'           `.: ..  -. \' :. ://  _.-\' _.-  '.inverse
						echo '   '+'             >;._.:._.;,-=_(.-\'  __ `._   '.inverse
						echo '   '+'           ,;\'  _..-((((\'\'  .,-\'\'  `-._   '.inverse
						echo '   '+'        _,\'<.-\'\'  _..``\'.\'`-\'`.        `  '.inverse
						echo '   '+'    _.-((((_..--\'\'       \ \ `.`.           '.inverse
						echo '   '+'  -\'  _.``\'               \      `         '.inverse
						echo '   '+'    ,\'                                    '.inverse
						echo '   '+'                                          '.inverse

					echo ''

			else usage()

	else noproject()
