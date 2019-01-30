let gulp = require('gulp');
gulp.task('styles:watch', function () {
    gulp.watch('src/style/**/*.scss', gulp.series('styles'));
});
