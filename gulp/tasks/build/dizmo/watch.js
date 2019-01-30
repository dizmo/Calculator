let pkg = require('../../../package.js'),
    gulp = require('gulp');

gulp.task('dizmo:watch', function () {
    gulp.watch('build/{0}/**/*'.replace('{0}', pkg.name), gulp.series(
        'dizmo'
    ));
});
