let gulp = require('gulp');
gulp.task('help:watch', function () {
    gulp.watch('help/**/*', gulp.series('help'));
});
