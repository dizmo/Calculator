let gulp = require('gulp');

require('../build/watch');
require('../deploy/watch');

gulp.task('watch', gulp.parallel(
    'build:watch',
    'deploy:watch'
));
