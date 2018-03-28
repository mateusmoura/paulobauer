const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
// const watch = require('gulp-watch');
const fileinclude = require('gulp-file-include');
const eslint = require('gulp-eslint');
const sourcemaps = require('gulp-sourcemaps');
const util = require('gulp-util');

const config = {
  srcDir: 'src/',
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
  (gulp.src(`${config.srcDir}/scss/*.scss`)
    .pipe(config.production ? util.noop() : sourcemaps.init())
    .pipe(sass({
      outputStyle: 'expanded',
    }).on('error', sass.logError))
    .pipe(config.production ? util.noop() : sourcemaps.write('./maps'))
    .pipe(gulp.dest(config.production ? `${config.assetDir}/css` : `${config.assetDir}/css`))
    .pipe(config.production ? util.noop() : browserSync.stream())));

gulp.task('images', () => (
  gulp.src(`${config.srcDir}/img/{**/,}*.*`)
    .on('error', sass.logError)
    .pipe(gulp.dest(`${config.assetDir}/img`))
));

gulp.task('plugins', () => (
  gulp.src(`${config.srcDir}/plugins/{**/,}*.*`)
    .on('error', sass.logError)
    .pipe(gulp.dest(`${config.assetDir}/plugins`))
));

gulp.task('js', () => (
  gulp.src(`${config.srcDir}/js/{**/,}*.*`)
    .on('error', sass.logError)
    .pipe(gulp.dest(`${config.assetDir}/js`))
));

// Static Server + hot reload + watching scss/js/html files
gulp.task('serve', ['sass', 'fileinclude'], () => {
  browserSync.init({
    server: {
      baseDir: config.srcDir,
    },
  });

  gulp.watch([`${config.srcDir}/scss/*.scss`, `${config.srcDir}/scss/*/*.scss`], ['sass']);
  gulp.watch(`${config.srcDir}/js/*.js`).on('change', browserSync.reload);
  gulp.watch([`${config.srcDir}/*.html`, `${config.srcDir}/includes/*.html`], ['fileinclude']).on('change', () => {
    setTimeout(() => {
      browserSync.reload();
    }, 1000);
  });
});

const tasks = config.production ? ['sass', 'fileinclude', 'images', 'plugins', 'js'] : ['serve'];

gulp.task('default', tasks);