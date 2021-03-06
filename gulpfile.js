const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
// const watch = require('gulp-watch');
const fileinclude = require('gulp-file-include');
const eslint = require('gulp-eslint');
const sourcemaps = require('gulp-sourcemaps');
const util = require('gulp-util');
const uglify = require('gulp-uglify');
const browserify = require('gulp-browserify');
const rename = require('gulp-rename');
const concat = require('gulp-concat');

const config = {
  srcDir: 'src',
  assetDir: 'assets/',
  wordpressDir: '../wordpress/wp-content/themes/fisk_brasilia_2018/',
  production: !!util.env.production,
};

gulp.task('lint', () =>
  (gulp.src(['**/*.js', '!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())));

// Include HTML
gulp.task('fileinclude', () => {
  gulp.src([`${config.srcDir}/*.html`])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file',
    }))
    .pipe(gulp.dest(config.production ? `${config.assetDir}/html` : `${config.srcDir}/html`));
});

// Sass to css conversion
gulp.task('sass', () =>
  (gulp.src(`${config.srcDir}/sass/*.scss`)
    .pipe(config.production ? util.noop() : sourcemaps.init())
    .pipe(sass({
      errLogToConsole: true,
      outputStyle: 'expanded',
      sourceComments: 'normal',
    }).on('error', sass.logError))
    .pipe(config.production ? util.noop() : sourcemaps.write('./maps'))
    .pipe(gulp.dest(config.production ? `${config.assetDir}/css` : `${config.srcDir}/css`))
    .pipe(config.production ? util.noop() : browserSync.stream())));

gulp.task('styles', () => (
  gulp.src(`${config.srcDir}/css/{**/,}*.*`)
    .on('error', sass.logError)
    .pipe(gulp.dest(`${config.assetDir}/css`))
));

gulp.task('images', () => (
  gulp.src(`${config.srcDir}/images/{**/,}*.*`)
    .on('error', sass.logError)
    .pipe(gulp.dest(config.production ? `${config.assetDir}/images` : `${config.assetDir}/images`))
));

// gulp.task('plugins', () => (
//   gulp.src(`${config.srcDir}/plugins/{**/,}*.*`)
//     .on('error', sass.logError)
//     .pipe(gulp.dest(`${config.assetDir}/plugins`))
// ));

gulp.task('js', () => (
  gulp.src(`${config.srcDir}/js/base.js`)
    .on('error', sass.logError)
    .pipe(browserify({
      insertGlobals : true,
      debug : true,
    }))
    .pipe(concat('main.js'))
    .pipe(gulp.dest(config.production ? `${config.assetDir}/js` : `${config.srcDir}/js`))
));

gulp.task('javascript', () => (
  gulp.src(`${config.srcDir}/js/{**/,}*.*`)
    .on('error', sass.logError)
    .pipe(gulp.dest(`${config.assetDir}/js`))
));

gulp.task('data', () => (
  gulp.src(`${config.srcDir}/docs/{**/,}*.*`)
    .on('error', sass.logError)
    .pipe(gulp.dest(`${config.assetDir}/docs`))
));

// Static Server + hot reload + watching scss/js/html files
gulp.task('serve', ['sass', 'fileinclude', 'js'], () => {
  browserSync.init({
    server: {
      baseDir: config.srcDir,
    },
  });

  gulp.watch([`${config.srcDir}/sass/*.scss`, `${config.srcDir}/sass/*/*.scss`], ['sass']);
  gulp.watch([`${config.srcDir}/js/*.js`, `${config.srcDir}/js/{**/,}*.js`], ['js']);//.on('change', browserSync.reload);
  gulp.watch([`${config.srcDir}/*.html`, `${config.srcDir}/includes/*.html`], ['fileinclude']).on('change', () => {
    setTimeout(() => {
      browserSync.reload();
    }, 1000);
  });
});

const tasks = config.production ? ['styles', 'fileinclude', 'images', 'javascript', 'data'] : ['serve'];

gulp.task('default', tasks);