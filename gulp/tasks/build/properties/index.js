let pkg = require('../../../package.js'),
    fs = require('fs'),
    path = require('path');
let gulp = require('gulp'),
    gulp_plist = require('gulp-plist'),
    gulp_rename = require('gulp-rename');
let lodash = require('lodash');

gulp.task('properties', function () {
    let settings = lodash.mapKeys(pkg.dizmo.settings, function (v, k) {
        return lodash.upperFirst(lodash.camelCase(k));
    });
    if (fs.existsSync('.info.plist')) {
        return gulp.src('.info.plist')
            .pipe(gulp_plist(settings))
            .pipe(gulp_rename('Info.plist'))
            .pipe(gulp.dest(path.join('build', pkg.name)));
    } else {
        this.emit('error', new Error('no .info.plist'));
    }
});
