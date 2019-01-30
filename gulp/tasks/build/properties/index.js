let pkg = require('../../../package.js'),
    fs = require('fs'),
    path = require('path');
let gulp = require('gulp'),
    gulp_plist = require('gulp-plist'),
    gulp_rename = require('gulp-rename');
let lodash = require('lodash');

lodash.mixin({
    deep: function (obj, mapper) {
        return mapper(lodash.mapValues(obj, function (v) {
            return lodash.isPlainObject(v) ? lodash.deep(v, mapper) : v;
        }));
    },
});

gulp.task('properties', function () {
    let settings = lodash.deep(pkg.dizmo.settings, function (s) {
        return lodash.mapKeys(s, function (v, k) {
            return lodash.upperFirst(lodash.camelCase(k));
        });
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
