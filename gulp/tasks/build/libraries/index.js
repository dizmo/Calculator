let pkg = require('../../../package.js'),
    path = require('path'),
    gulp = require('gulp');

gulp.task('libraries', function () {
    return gulp.src(['src/lib/**/*'], {base: 'src'})
        .pipe(gulp.dest(path.join('build', pkg.name)));
});
