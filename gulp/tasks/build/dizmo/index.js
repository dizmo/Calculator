let pkg = require('../../../package.js');
let gulp = require('gulp'),
    gulp_ver = require('gulp-ver'),
    gulp_zip = require('gulp-zip');

gulp.task('dizmo', function () {
    return gulp.src(['build/**/*'], {base: 'build'})
        .pipe(gulp_zip('{0}.dzm'.replace('{0}', pkg.name)))
        .pipe(gulp_ver())
        .pipe(gulp.dest('build'));
});
