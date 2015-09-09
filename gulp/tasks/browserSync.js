var browserSync = require('browser-sync');
var gulp        = require('gulp');
var config      = require('../config').browserSync;
var bundleLogger = require('../util/bundleLogger');

gulp.task('browserSync', function() {
  browserSync.init(config);
});
