	var gulp 		= require('gulp'),
		sass 		= require('gulp-sass'),
		cleanCSS 	= require('gulp-clean-css'),
		rename 		= require("gulp-rename"),
		uglify 		= require('gulp-uglify'),
		browserSync = require('browser-sync').create();

	
	// Compile SCSS
	gulp.task('css:compile', function() {
	return gulp.src('./src/scss/**/*.scss')
		.pipe(sass.sync({
		outputStyle: 'expanded'
		}).on('error', sass.logError))
		.pipe(gulp.dest('./dist/assets/css'))
	});

	// Minify CSS
	gulp.task('css:minify', ['css:compile'], function() {
	return gulp.src([
		'./dist/assets/css/*.css',
		'!./dist/assets/css/*.min.css'
		])
		.pipe(cleanCSS())
		.pipe(rename({
		suffix: '.min'
		}))
		.pipe(gulp.dest('./dist/assets/css'))
		.pipe(browserSync.stream());
	});

	// CSS
	gulp.task('css', ['css:compile', 'css:minify']);
	
	// Minify JavaScript
	gulp.task('js:minify', function() {
	return gulp.src([
		'./src/js/*.js'
		])
		.pipe(uglify())
		.pipe(rename({
		suffix: '.min'
		}))
		.pipe(gulp.dest('./dist/assets/js'))
		.pipe(browserSync.stream());
	});
	// JS
	gulp.task('js', ['js:minify']);
	
	// Default task
	gulp.task('default', ['css', 'js']);
	// Configure the browserSync task
	gulp.task('browserSync', function() {
		browserSync.init({
			server: {
			baseDir: "./"
			}
		});
	});
	// Dev task
	gulp.task('dev', ['css', 'js', 'browserSync'], function() {
		gulp.watch('./src/scss/**/*.scss', ['css']);
		gulp.watch('./src/js/*.js', ['js']);
		gulp.watch('./example/*.html', browserSync.reload);
	});
