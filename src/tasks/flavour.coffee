


###
grunt.file.write foundationdrupal+'/template.php',
	grunt.file.read(fdnSrc+'/template.php').replace(/STARTER/g, flags.name)
###


###
grunt.file.write foundationdrupal+'/'+flags.name+'.info',
	grunt.file.read(fdnSrc+'/STARTER.info.txt')
###