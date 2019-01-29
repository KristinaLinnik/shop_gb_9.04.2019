'use strict';

var gulp = require('gulp'),
	prefixer = require('gulp-autoprefixer'),
	sass = require('gulp-sass'),
	concat = require('gulp-concat');

gulp.task('sass', function () {
	return gulp.src('./data/css/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(prefixer())
		.pipe(gulp.dest('./data/css'));
});


gulp.task('watch', function () {
	gulp.watch('./data/css/**/*.scss', ['sass']);
});


gulp.task('default', ['watch']);
