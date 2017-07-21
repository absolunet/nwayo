require 'sass/plugin'

Encoding.default_external = 'utf-8'



class CSSImporter < Sass::Importers::Filesystem
  def extensions
    super.merge('css' => :scss)
  end
end
Sass::Plugin.options[:filesystem_importer] = CSSImporter




module Sass::Script::Functions

  def readfile(file)
    Sass::Script::String.new( __readfile(file) )
  end
  declare :readfile, [:string]


  def fileexists(file)
    Sass::Script::Bool.new(File.exists?(file.value))
  end
  declare :fileexists, [:string]

  def inline_image(path, mime_type = nil)
    path = path.value
    real_path = path
    inline_image_string(data(real_path), compute_mime_type(path, mime_type))
  end
  declare :inline_image, [:string]

protected
  def inline_image_string(data, mime_type)
    data = [data].flatten.pack('m').gsub("\n","")
    url = "url('data:#{mime_type};base64,#{data}')"
    unquoted_string(url)
  end

private
  def __readfile(real_path)
    if File.readable?(real_path.value)
      File.open(real_path.value, "rb") {|io| io.read}
    else
      raise ArgumentError, "File not found or cannot be read: #{real_path}"
    end
  end

  def compute_mime_type(path, mime_type = nil)
    return mime_type.value if mime_type
    case path
    when /\.png$/i
      'image/png'
    when /\.jpe?g$/i
      'image/jpeg'
    when /\.gif$/i
      'image/gif'
    when /\.svg$/i
      'image/svg+xml'
    when /\.otf$/i
      'font/opentype'
    when /\.eot$/i
      'application/vnd.ms-fontobject'
    when /\.ttf$/i
      'font/truetype'
    when /\.woff$/i
      'application/font-woff'
    when /\.off$/i
      'font/openfont'
    when /\.([a-zA-Z]+)$/
      "image/#{Regexp.last_match(1).downcase}"
    else
      raise ArgumentError, "A mime type could not be determined for #{path}, please specify one explicitly."
    end
  end

  def data(real_path)
    if File.readable?(real_path)
      File.open(real_path, "rb") {|io| io.read}
    else
      raise ArgumentError, "File not found or cannot be read: #{real_path}"
    end
  end

end
