var gulp = require('gulp');
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var browserSync = require('browser-sync').create();
var nodemon = require('gulp-nodemon');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('bundle:sass', function () {
  return gulp.src('./client/theme/style.scss')
	.pipe(sourcemaps.init())
	.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
	.pipe(sourcemaps.write('./maps'))
	.pipe(gulp.dest('./assets/css'));
});

gulp.task("bundle:js",function(){
	return browserify({
		entries: [ './client/main.js' ]
	})
	.bundle()
	.pipe(source('app.js'))
	.pipe(gulp.dest('./assets/js/'));
});

gulp.task("bundle", ['bundle:sass', 'bundle:js']);

gulp.task('nodemon', ['bundle'], function(cb) {
  return nodemon({
    script: 'bin/www'
  });
});

gulp.task('watch', function() {
  gulp.watch('./client/theme/*.scss', ['sass']);
  gulp.watch(['./client/**/*.js'], ['bundle']);
})

gulp.task('serve', ['nodemon'], function(){
	browserSync.init({
    proxy: 'http://127.0.0.1:3000',
    browser: 'google chrome',
    port: 8000
  });

  gulp.watch(['views/*', 'assets/**/*.+(css|js)']).on('change', browserSync.reload);
});

gulp.task("default",['serve', 'watch']);



