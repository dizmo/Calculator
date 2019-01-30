let gulp = require('gulp');
gulp.task('assets:watch', function () {
    gulp.watch('assets/**/*', gulp.series('assets'));
});
