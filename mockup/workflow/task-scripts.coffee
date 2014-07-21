# "gulp-jshint": "~1.5.5",
# "gulp-uglify": "~0.2.1"
#jshint   = require 'gulp-jshint'
#uglify   = require 'gulp-uglify'


# gulp.task 'default', ->
# 
# 	console.log 'yahoo'

# var paths = {
#   scripts: ['client/js/**/*.coffee', '!client/external/**/*.coffee'],
#   images: 'client/img/**/*'
# };
# 
# gulp.task('scripts', function() {
#   // Minify and copy all JavaScript (except vendor scripts)
#   return gulp.src(paths.scripts)
#     .pipe(coffee())
#     .pipe(uglify())
#     .pipe(concat('all.min.js'))
#     .pipe(gulp.dest('build/js'));
# });
# 
# // Copy all static images
# gulp.task('images', function() {
#  return gulp.src(paths.images)
#     // Pass in options to the task
#     .pipe(imagemin({optimizationLevel: 5}))
#     .pipe(gulp.dest('build/img'));
# });
# 
# // Rerun the task when a file changes
# gulp.task('watch', function() {
#   gulp.watch(paths.scripts, ['scripts']);
#   gulp.watch(paths.images, ['images']);
# });
# 
# // The default task (called when you run `gulp` from cli)
# gulp.task('default', ['scripts', 'images', 'watch']);

