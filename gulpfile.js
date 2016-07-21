'use strict';

// Write the project name here
const activeProject = 'project1';

// Dependencies
const gulp = require('gulp');
const babel = require('gulp-babel');
const browserSync = require('browser-sync');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const csscomb = require('gulp-csscomb');
const nodemon = require('gulp-nodemon');

// Variables
const reload = browserSync.reload;
const cssCombConfigFile = './csscomb.json'; // css linter
const prefixQuery = ['Firefox >= 15', 'IE >= 9', 'Chrome >= 25', 'iOS >= 5', 'Safari >= 7'];

// Directory files
const project = './app/' + activeProject + '/';
const cssDir = project + 'css/';
const scssDir = project + 'scss/';
const jsDir = project + 'js/';
const serverDir = './server/';

// Watch these files
const files = {
  scss: scssDir + '**/*.scss',
  html: project + '*.html',
  js: [serverDir + '*.js', jsDir + '*.js'],
  components: project + 'components/*.html'
};

// browsersync  Server + file watch + js transpilation + express server
gulp.task('serve', ['nodemon', 'sass', 'babel'], () => {
  browserSync({ server: project });
  gulp.watch(files.js, ['js-watch']);
  gulp.watch(files.components, reload);
  gulp.watch(files.html).on('change', reload);
  gulp.watch(files.scss, ['sass']);
});

// Compile sass into CSS
gulp.task('sass', () => {
  return gulp.src(scssDir + 'styles.scss')
             .pipe(sass().on('error', sass.logError))
             .pipe(autoprefixer({
               browsers: prefixQuery,
               cascade: false,
               add: true
             }))
             .pipe(csscomb(cssCombConfigFile))
             .pipe(gulp.dest(cssDir))
             .pipe(reload({ stream: true }));
});

// Compile JS to ES6
gulp.task('babel', () => {
  return gulp.src([jsDir + '*.js', serverDir + '*.js'])
             .pipe(babel({ presets: ['es2015'] }))
             .pipe(gulp.dest(project + 'dist/js/'));
});

// Start the express server
gulp.task('nodemon', (cb) => {
  let started = false;
  return nodemon({ script: project + 'dist/js/server.js' }).on(['start'], () => {
    // to avoid nodemon being started multiple times
    if (!started) {
      cb();
      started = true;
    }
  });
});

gulp.task('js-watch', ['babel'], browserSync.reload);

gulp.task('default', ['serve']);
