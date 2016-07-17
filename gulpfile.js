//write the project name here
var activeProject = 'project1';
var gulp = require('gulp');
const babel = require('gulp-babel');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var reload = browserSync.reload;
const autoprefixer = require('gulp-autoprefixer');    // Prefixes the CSS
const csscomb = require('gulp-csscomb');              // Formats the css file
                                                      // according to the
                                                      // csscomb.json file

var project = './app/' + activeProject + '/';
var cssDir = project + 'css/';
var scssDir = project + 'scss/';
var jsDir = project + 'js/';

var files = {
  scss: scssDir + '**/*.scss',
  html: project + '*.html',
  js: project + 'js/*.js',
  components: project + 'components/*.html'
};

var cssCombConfigFile = './csscomb.json';

// Static Server + watching scss/html files
gulp.task('serve', ['sass', 'babel'], function () {

  browserSync({
    server: project
  });

  gulp.watch(files.scss, ['sass']);
  gulp.watch(files.html).on('change', reload);
  gulp.watch(files.components, reload);
  gulp.watch(files.js, ['js-watch']);
});

// Compile sass into CSS
gulp.task('sass', function () {
  return gulp.src(scssDir + 'styles.scss')
             .pipe(sass().on('error', sass.logError))
             .pipe(autoprefixer({
               browsers: [
                 'Firefox >= 15',
                 'IE >= 9',
                 'Chrome >= 25',
                 'iOS >= 5',
                 'Safari >= 7'
               ],
               cascade: false,
               add: true
             }))
             .pipe(csscomb(cssCombConfigFile))
             .pipe(gulp.dest(cssDir))
             .pipe(reload({ stream: true }));
});

// Compile JS to ES6
gulp.task('babel', () => {
  return gulp.src(jsDir + '*.js')
             .pipe(babel({ presets: ['es2015'] }))
             .pipe(gulp.dest(project + 'dist/js/'));
});

gulp.task('js-watch', ['babel'], browserSync.reload);

gulp.task('default', ['serve']);
