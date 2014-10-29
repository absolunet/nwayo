fs     = require 'fs'
path   = require 'path'
should = require 'should'
cli    = require '../lib/cli'

pkg     = require '../package.json'
version = pkg.version

expected = (name) -> fs.readFileSync "#{__dirname}/expected/#{name}.txt", 'utf8'

runCLI = (cmd) ->
	stripcolorcodes = require 'stripcolorcodes'

	out = []
	bk = console.log
	console.log = (str) -> out.push str

	cli.argv cmd.split ' '

	console.log = bk

	return stripcolorcodes out.join '\n'



describe 'nwayo', ->

	describe '[empty] - usage', ->
		out = runCLI ''

		it 'should contain the commands', ->
			out.should.containEql expected('usage')

		it 'should contain the package version', ->
			out.should.containEql version

		it 'should contain the executable path', ->
			out.should.containEql path.dirname(__dirname)



	describe 'version', ->
		out = runCLI 'version'

		it 'should return the package version', ->
			out.should.eql version



	describe '[UNKNOWN]', ->
		out = runCLI 'UNKNOWN'

		it 'should return the usage', ->
			out.should.containEql expected('usage')


