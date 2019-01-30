let gulp = require('gulp');
gulp.task('properties:watch', function () {
    gulp.watch('package.json', gulp.series('properties'));
});
