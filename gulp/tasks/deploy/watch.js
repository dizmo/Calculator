let pkg = require('../../package.js'),
    gulp = require('gulp');

gulp.task('deploy:watch', function () {
    gulp.watch('build/{0}/**/*'.replace('{0}', pkg.name), gulp.series(
        'deploy:only'
    ));
});
