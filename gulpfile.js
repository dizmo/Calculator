const gulp = require('gulp');

require('./gulp/tasks/lint');
require('./gulp/tasks/clean');
require('./gulp/tasks/build');
require('./gulp/tasks/deploy');
require('./gulp/tasks/upload');
require('./gulp/tasks/watch');

gulp.task('default', gulp.series(
    'build'
));
