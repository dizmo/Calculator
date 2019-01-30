let pkg = require('../../../package.js');
let gulp = require('gulp'),
    gulp_copy = require('gulp-copy');

gulp.task('assets:base', function () {
    return gulp.src([
        'assets/Icon.*', 'assets/Icon-dark.*', 'assets/Preview.*'
    ]).pipe(
        gulp_copy('build/{0}/'.replace('{0}', pkg.name), {
            prefix: 1
        })
    );
});
gulp.task('assets:main', function () {
    return gulp.src([
        'assets/**/*'
    ]).pipe(
        gulp_copy('build/{0}/assets/'.replace('{0}', pkg.name), {
            prefix: 1
        })
    );
});
gulp.task('assets', gulp.series(
    'assets:base', 'assets:main'
));
