/* Node modules and imports:
 ****************************/

var gulp = require('gulp');
var newer = require('gulp-newer');
var preprocess = require('gulp-preprocess');
var imagemin = require('gulp-imagemin');
var htmlclean = require('gulp-htmlclean');
var size = require('gulp-size');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var del = require('del');

var pkg = require('./package.json');


/* File locations:
 ****************************/

var devBuild = ((process.env.NODE_ENV || 'development').trim().toLowerCase() !== 'production');
var source = 'source/',
  dest = 'build/',
  html = { in : source + '*.html',
      watch: [source + '*.html', source + 'template/**/*'],
      out: dest,
      context: {
        devBuild: devBuild,
        author: pkg.author,
        version: pkg.version
      }
  },
  images = { in : source + 'images/*.*',
      out: dest + 'images/'
  },
  css = { in : source + 'scss/main.scss',
      watch: [source + 'scss/**/*'],
      out: dest + 'css/',
      sassOpts: {
        outputStyle: 'nested',
        imagePath: '../images',
        precision: 3,
        errLogToConsole: true
      }
  },
  js = { in : source + '/js/*.js',
      watch: [source + '/js/*.js'],
      out: dest + '/js'
  }


/* Show build type:
 ****************************/

console.log(pkg.name + ' ' + pkg.version + ', ' + (devBuild ? 'development' : 'production') + ' build');


/* Clean build folder:
 ****************************/

gulp.task('clean', function() {
  del([
    dest + '*'
  ]);
});


/* Build HTML files:
 ****************************/

gulp.task('html', function() {
  var page = gulp.src(html.in).pipe(preprocess({
    context: html.context
  }));
  if (!devBuild) {
    page = page
      .pipe(size({
        title: 'HTML in'
      }))
      .pipe(htmlclean())
      .pipe(size({
        title: 'HTML out'
      }));
  }
  return page.pipe(gulp.dest(html.out));
});


/* Compile Sass:
 ****************************/

gulp.task('sass', function() {
  return gulp.src(css.in)
    .pipe(sass(css.sassOpts))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest(css.out))
});


/* Manage images:
 ****************************/

gulp.task('images', function() {
  return gulp.src(images.in)
    .pipe(newer(images.out))
    .pipe(imagemin())
    .pipe(gulp.dest(images.out));
});


/* Build JS files:
 ****************************/

gulp.task('js', function() {
  return gulp.src(js.in)
    .pipe(gulp.dest(js.out));
});


/* Default task:
 ****************************/

gulp.task('default', ['html', 'js', 'images', 'sass'], function() {
  gulp.watch(html.watch, ['html']); // HTML changes
  gulp.watch(js.watch, ['js']);  // JS changes
  gulp.watch(images.watch, ['images']); // Image changes
  gulp.watch(css.watch, ['sass']); // Sass changes
});
