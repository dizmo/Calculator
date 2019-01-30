let gulp = require('gulp'),
    rimraf = require('rimraf');

gulp.task('clean', function (done) {
    rimraf('build', done)
});
