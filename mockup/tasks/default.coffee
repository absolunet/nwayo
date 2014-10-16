#debug = require 'gulp-debug'
gulp  = require 'gulp'
pkg   = require '../package.json'

util = require './_util'
path = util.path()
echo = console.log




#-- Rebuild
gulp.task 'rebuild', (cb) ->
	runsequence = require 'run-sequence'
	runsequence ['assets', 'icons', 'scripts', 'styles'], cb


#-- Rebuild scripts & styles
gulp.task 'rebuild-ss', (cb) ->
	runsequence = require 'run-sequence'
	runsequence ['scripts', 'styles'], cb


#-- Scan for node updates
gulp.task 'scan-node', (cb) ->
	colors = require 'colors'
	david  = require 'david'

	echo ''
	david.getUpdatedDependencies pkg, dev:true, (er, deps) ->

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



#-- Scan for bower updates
gulp.task 'scan-bower', (cb) ->
	colors = require 'colors'
	bower = require 'bower'

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




#-- Default menu
gulp.task 'default', (cb) ->
	colors      = require 'colors'
	runsequence = require 'run-sequence'
	inquirer    = require 'inquirer'

	echo '\n'
	echo " #{pkg.name} ".bgGreen.bold + "    [#{pkg._framework}]".yellow.italic
	echo ''

	inquirer.prompt [
		{
			name:    'levelone'
			message: 'Alo! Ki sa ou vle?'
			type:    'list'
			choices: [
				{ name:'Watch',           value:'watch' }
				{ name:'Rebuild options', value:'options_rebuild' }
				{ name:'Scan options',    value:'options_scan' }
			]
		}
		{
			name:    'task'
			message: 'Rebuild ...'
			type:    'list'
			choices: [
				{ name:'Everything',       value:'rebuild' }
				{ name:'Scripts & styles', value:'rebuild-ss' }
				new inquirer.Separator()
				{ name:'Assets only',      value:'assets' }
				{ name:'Icons only',       value:'icons' }
				{ name:'Scripts only',     value:'scripts' }
				{ name:'Styles only',      value:'styles' }
			]
			when: (data) -> data.levelone == 'options_rebuild'
		}
		{
			name:    'scan'
			message: 'Scan for ...'
			type:    'list'
			choices: [
				{ name:'Node packages updates',  value:'scan-node' }
				{ name:'Bower packages updates', value:'scan-bower' }
			]
			when: (data) -> data.levelone == 'options_scan'
		}
	], (data) ->
		task = data.levelone if data.levelone == 'watch'
		task = data.task if data.task
		task = data.scan if data.scan

		echo '\n\n'
		runsequence task, cb
