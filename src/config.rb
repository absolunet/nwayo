project_path="."
css_path="./build/styles"
sass_path="./common/bundles"
fonts_path="."
images_path="."
additional_import_paths=""


module Sass::Script::Functions

  def readfile(file)
    Sass::Script::String.new( __readfile(file) )
  end
  declare :readfile, [:string]


  def fileexists(file)
    Sass::Script::Bool.new(File.exists?(file.value))
  end
  declare :fileexists, [:string]


  def __readfile(real_path)
    if File.readable?(real_path.value)
      File.open(real_path.value, "rb") {|io| io.read}
    else
      raise Compass::Error, "File not found or cannot be read: #{real_path}"
    end
  end

end

class CSSImporter < Sass::Importers::Filesystem
  def extensions
    super.merge('css' => :scss)
  end
end
Sass::Plugin.options[:filesystem_importer] = CSSImporter
