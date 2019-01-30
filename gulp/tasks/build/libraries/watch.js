let gulp = require('gulp');
gulp.task('libraries:watch', function () {
    gulp.watch('src/lib/**/*', gulp.series('libraries'));
});
