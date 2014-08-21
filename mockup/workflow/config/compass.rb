project_path=".."
css_path="../build/styles"
sass_path="../common/bundles"
fonts_path=".."
images_path=".."
additional_import_paths=""




module Sass::Script::Functions


	# string replace
	# source: https://github.com/Team-Sass/Sassy-Strings
	def nwayo_str_replace(string, find, replace)
		assert_type string, :String
		assert_type replace, :String
		Sass::Script::String.new(string.value.gsub(find.value,replace.value), string.type)
	end
	declare :nwayo_str_replace, [:string, :find, :replace]



end
