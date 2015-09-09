var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    Config = require('./gulp/config');
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    handleErrors = require('./gulp/util/handleErrors'),
    browserify   = require('browserify'),
    watchify     = require('watchify'),
    bundleLogger = require('./gulp/util/bundleLogger'),
    source       = require('vinyl-source-stream');

var config;

gulp.task('browserSync', function () {
   browserSync.init(config.browserSync);
});

gulp.task('less', function() {
  config = Config.less;
  return gulp.src(config.src)
    .pipe(sourcemaps.init())
    .pipe(less())
    .on('error', handleErrors)
    .pipe(autoprefixer({cascade: false, browsers: ['last 2 versions']}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.dest));
});

gulp.task('watch', function() {
  config = Config;
  gulp.watch(config.less.watch, ['less']);
  gulp.watch(config.markup.src, ['markup']);
});


gulp.task('markup', function() {
  return gulp.src(config.src)
    .pipe(gulp.dest(config.dest));
});


gulp.task('browserify', function(callback) {

  config = Config.browserify;

  var bundleQueue = config.bundleConfigs.length;

  var browserifyThis = function(bundleConfig) {

    var bundler = browserify({
      // Required watchify args
      cache: {}, packageCache: {}, fullPaths: false,
      // Specify the entry point of your app
      entries: bundleConfig.entries,
      // Add file extentions to make optional in your requires
      extensions: config.extensions,
      // Enable source maps!
      debug: true
    });

    var bundle = function() {
      // Log when bundling starts
      bundleLogger.start(bundleConfig.outputName);

      return bundler
        .bundle()
        // Report compile errors
        .on('error', handleErrors)
        // Use vinyl-source-stream to make the
        // stream gulp compatible. Specifiy the
        // desired output filename here.
        .pipe(source(bundleConfig.outputName))
        // Specify the output destination
        .pipe(gulp.dest(bundleConfig.dest))
        .on('end', reportFinished);
    };

   
    // Wrap with watchify and rebundle on changes
    bundler = watchify(bundler);
    // Rebundle on update
    bundler.on('update', bundle);


    var reportFinished = function() {
      // Log when bundling completes
      bundleLogger.end(bundleConfig.outputName);

      if(bundleQueue) {
        bundleQueue--;
        if(bundleQueue === 0) {
          // If queue is empty, tell gulp the task is complete.
          // https://github.com/gulpjs/gulp/blob/master/docs/API.md#accept-a-callback
          callback();
        }
      }
    };

    return bundle();
  };

  // Start bundling with Browserify for each bundleConfig specified
  config.bundleConfigs.forEach(browserifyThis);
});


gulp.task('build', ['watch', 'browserSync', 'less', 'browserify'])

gulp.task('default', ['build']);