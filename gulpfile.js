const browserSync = require('browser-sync'),
    gulp = require('gulp'),
    autoPrefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    flatten = require('gulp-flatten'),
    cssNano = require('gulp-cssnano'),
    imageMin = require('gulp-imagemin'),
    sass = require('gulp-sass'),
    sftp = require('gulp-sftp'),
    sourcemaps = require('gulp-sourcemaps'),
    watch = require('gulp-watch'),
    runSequence = require("run-sequence"),
    twig = require("gulp-twig");

// Paths
let paths = {
    dist: '.dist',
    static_dist: ".dist",
    src: './assets/'
};

// Clean
gulp.task("clean", function(callback) {
    runSequence(
        "clean_templates",
        "clean_static",
        callback
    )
});

gulp.task('clean_templates', require('del').bind(null, [paths.dist]));
gulp.task('clean_static', require('del').bind(null, [paths.static_dist]));


// Styles
gulp.task('styles', function() {
    return gulp.src(paths.src + 'styles/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoPrefixer({
            browsers: [
                'last 2 version',
                'android 2.3',
                'android 4',
                'opera 12'
            ]
        }))
        .pipe(cssNano())
        .pipe(sourcemaps.write('sourcemaps'))
        .pipe(gulp.dest(paths.static_dist + 'css'))
        .pipe(browserSync.stream());
});


// Scripts
gulp.task('scripts', function() {
    return gulp.src(paths.src + 'scripts/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('sourcemaps'))
        .pipe(gulp.dest(paths.static_dist + 'javascript'))
        .pipe(browserSync.stream());
});


// Images
gulp.task('images', function() {
    return gulp.src(paths.src + 'images/*')
        .pipe(imageMin({
            progressive: true,
            interlaced: true,
            svgoPlugins: [{removeUnknownsAndDefaults: false}, {cleanupIDs: false}]
        }))
        .pipe(gulp.dest(paths.static_dist + 'images'))
        .pipe(browserSync.stream());
});


// Templates
gulp.task('twigIncludeMain', function() {
    return gulp.src(paths.src + 'templates/*.twig')
        .pipe(twig({
            extname: ".html"
        }))
        .pipe(gulp.dest(paths.dist))
        .pipe(browserSync.stream());
});

gulp.task('html', function(callback) {
    runSequence(
        "twigIncludeMain",
        callback
    )
});


// Fonts
gulp.task('fonts', function() {
    return gulp.src(paths.src + 'fonts/*')
        .pipe(flatten())
        .pipe(gulp.dest(paths.static_dist + 'fonts'))
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


// Special task that is like default but does not clean
gulp.task('deploy', function(callback) {
    runSequence(
        'styles',
        'scripts',
        'fonts',
        'images',
        'html',
        callback);
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

//gulp.task('clean', function (done) {
//  $.del(['.tmp', 'dist'], done);
//});

    gulp.watch('./assets/templates/**/*', ['html']);
    gulp.watch('./assets/scripts/**/*', ['scripts']);
    gulp.watch('./assets/fonts/**/*', ['fonts']);
    gulp.watch('./assets/images/**/*', ['images']);
    gulp.watch('./assets/styles/**/*.scss', ['styles']);
});
