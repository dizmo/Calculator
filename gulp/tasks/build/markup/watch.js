let gulp = require('gulp');
gulp.task('markup:watch', function () {
    gulp.watch('src/**/*.html', gulp.series('markup'));
});
