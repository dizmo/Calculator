let pkg = require('../../../package.js'),
    path = require('path');
let gulp = require('gulp'),
    gulp_zip = require('gulp-zip');

gulp.task('help', function () {
    return gulp.src('help/**/*', {base: '.'})
        .pipe(gulp_zip('help.zip'))
        .pipe(gulp.dest(path.join('build', pkg.name)));
});
