'use strict';

process.title = 'nwayo';

cwd  = process.cwd()
echo = console.log

# modules
fs        = require 'fs'
path      = require 'path'
colors    = require 'colors'
minimist  = require 'minimist'
projpkg   = require "#{cwd}/package"
nwayopkg  = require '../package'

configfile = '.nwayorcs'
projconf   = JSON.parse fs.readFileSync("#{cwd}/#{configfile}") if fs.existsSync "#{cwd}/#{configfile}"


# arguments
argv    = minimist process.argv.slice 2
command = argv._[0]
target  = argv._[1]


usage = -> 
	echo [
		'\n'
		'Usage: ' + 'nwayo'.yellow + ' <command>'.cyan
		''
		'Project commands'.underline
		'nwayo analyze'.yellow + ' <name>'.cyan + '   analyze node|bower dependencies'
		'nwayo get'.yellow + ' <component>'.cyan + '  install a nwayo component'
		'nwayo run'.yellow + ' <task>'.cyan + '       run a task'
		''
		'Global commands'.underline
		'nwayo version'.yellow + '          get cli version'
		'nwayo grow'.yellow + '             grow a new project'
		''
		"nwayo@#{nwayopkg.version} #{path.dirname __dirname}"
		''
	].join '\n '

noproject = -> echo "\n No #{configfile} file found".red




# switchboard
switch command
	
	# nwayo analyze <name>
	when 'analyze'
		if projconf

			switch target

				# nwayo analyze node
				when 'node'
					david  = require 'david'

					echo ''
					echo "   Analyzing #{projpkg.name.cyan} node dependencies"
					echo ''
					david.getUpdatedDependencies project, dev:true, (er, deps) ->

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
					colors = require 'colors'
					bower = require 'bower'

					echo ''
					echo "   Analyzing #{projpkg.name.cyan} bower dependencies"
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
	


	# nwayo get <component>
	when 'get'
		if projconf
			if target?
				echo 'getting '+argv._[1]
			
			else usage()
		
		else noproject()

	

	# nwayo run <task>
	when 'run'
		if projconf
			if target?
				echo 'running '+argv._[1]
			
			else usage()
			
		else noproject()





	# nwayo version
	when 'version'
		if target?
			echo require('../package').version
		
		else usage()



	# nwayo grow
	when 'grow'
		if target?
			echo 'growing'
			#grunt = require 'grunt'
			#grunt.file.setBase "#{__dirname}/.."
			#grunt.config.set 'cwd', cwd
			#grunt.tasks ['default']
		
		else usage()



	# nwayo <fubar>
	else usage()
