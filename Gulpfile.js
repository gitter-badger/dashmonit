var browserSync = require('browser-sync');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')({ pattern: ['gulp-*', 'del'] });
var sourcePath = './src'
var destPath = './assets'
var errorHandler = function() {
  var args = Array.prototype.slice.call(arguments);
  $.notify.onError({
    title: "Compile Error",
    message: "<%= error %>"
  }).apply(this, args);
  this.emit('end');
};

gulp.task('browser-sync', function() {
  browserSync({ server: { baseDir: '.' }});
});

gulp.task('build', function(cb) {
  return $.sequence('clean', 'sass', 'jade', cb);
});

gulp.task('clean', function (cb) {
  return $.del([destPath, './*.html'], cb);
});

gulp.task('default', ['build']);

gulp.task('dev', function(cb) {
  $.sequence.apply(this, ['watch', 'browser-sync', cb]);
});

gulp.task('jade', function() {
  return gulp.src(sourcePath + '/views/[^_]*.jade')
    .pipe($.jade({
      locals: {},
      pretty: true
    })).on('error', errorHandler)
    .pipe(gulp.dest('./'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('sass', function() {
  return gulp.src(sourcePath + '/stylesheets/main.scss')
    .pipe($.sass({
      indentedSyntax: false,
      includePaths: [
        sourcePath + '/stylesheets'
      ].concat(
        require('node-bourbon').includePaths,
        require('node-neat').includePaths,
        require('node-normalize-scss').includePaths
      )
    })).on('error', errorHandler)
    .pipe(gulp.dest(destPath + '/css'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('watch', ['build'], function() {
  $.watch(sourcePath + '/**/*.{scss,sass}', function() { gulp.start('sass'); });
  $.watch(sourcePath + '/**/*.jade', function() { gulp.start('jade'); });
});
