const browserSync = require('browser-sync'),
      gulp = require('gulp'),
      autoPrefixer = require('gulp-autoprefixer'),
      flatten = require('gulp-flatten'),
      cssNano = require('gulp-cssnano'),
      imageMin = require('gulp-imagemin'),
      sass = require('gulp-sass'),
      sourcemaps = require('gulp-sourcemaps'),
      watch = require('gulp-watch'),
      del = require('del'),
      fs = require("fs"),
      fse = require("fs-extra"),
      runSequence = require("run-sequence");

// If config.js doesn't exist, copy the template from config.js.example
if (!fs.existsSync("config.js")) {
    fse.copySync("config.js.example", "config.js");
    //fs.createReadStream("config.js.example").pipe(fs.createWriteStream("config.js"))
}

// Import custom paths
const config = require("./config.js");

gulp.task('clean', function () {
   return del([config.templates + "**", config.static + "**"], {force: true, dryRun: config.debug})
});


// Styles
gulp.task('styles', function() {
    return gulp
        .src(config.src + 'styles/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoPrefixer({
            browsers: [
                'last 2 version',
                'not dead',
                '> 0.5%',
                'opera 12'
            ]
        }))
        .pipe(cssNano())
        .pipe(sourcemaps.write('sourcemaps'))
        .pipe(gulp.dest(config.static + 'styles'))
        .pipe(browserSync.stream());
});


// Scripts
gulp.task('scripts', function() {
    return gulp
        .src(config.src + 'scripts/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('sourcemaps'))
        .pipe(gulp.dest(config.static + 'scripts'))
        .pipe(browserSync.stream());
});


// Images
gulp.task('images', function() {
    return gulp
        .src(config.src + 'images/*')
        .pipe(imageMin([
            imageMin.gifsicle({interlaced: true}),
            imageMin.jpegtran({progressive: true}),
            imageMin.optipng({optimizationLevel: 3}),
            imageMin.svgo({
                plugins: {
                    removeViewBox: true,
                    cleanupIDs: false,
                    removeUnknownsAndDefaults: false
                }
            })
            ]
        ))
        .pipe(gulp.dest(config.static + 'images'))
        .pipe(browserSync.stream());
});


// Templates
gulp.task('copyHtml', function () {
    return gulp.src(config.src + "templates/**/*")
        .pipe(gulp.dest(config.templates))
});

gulp.task('html', function(callback) {
    runSequence(
        "copyHtml",
        callback
    )
});


// Fonts
gulp.task('fonts', function() {
    return gulp
        .src(config.src + 'fonts/*')
        .pipe(flatten())
        .pipe(gulp.dest(config.static + 'fonts'))
        .pipe(browserSync.stream());
});


// Default Gulp Build
gulp.task('build', function(callback) {
    runSequence(
        'clean',
        'styles',
        'scripts',
        'fonts',
        'images',
        'html',
        callback);
});


// Gulp Build - Same as Default, but with a clean up beforehand
gulp.task('default', function() {
    runSequence(
        "build",
        "watch"
    );
});

// Gulp watch - watch changes of files in 'src' folder (run it by 'gulp watch')
gulp.task('watch', function() {

//    browserSync.init({
//        proxy: 'localhost/e-ledina/dist',
//        port: 4000,
//        ui: {
//            port: 4001
//        },
//        files: [
//            "./assets/**/*.{html,js,scss}"
//        ]
//    });

    gulp.watch('./assets/templates/**/*', ['html']);
    gulp.watch('./assets/scripts/**/*', ['scripts']);
    gulp.watch('./assets/fonts/**/*', ['fonts']);
    gulp.watch('./assets/images/**/*', ['images']);
    gulp.watch('./assets/styles/**/*.scss', ['styles']);
});
