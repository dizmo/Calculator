let pkg = require('../../../package.js'),
    path = require('path');
let gulp = require('gulp'),
    gulp_htmlmin = require('gulp-htmlmin');
let extend = require('xtend');

gulp.task('markup', function () {
    let cli_min = require('yargs')
        .default('minify')
        .argv.minify;

    let htmlmin = cli_min === true;
    if (pkg.dizmo && pkg.dizmo.build) {
        let cfg_min = pkg.dizmo.build.minify;
        if (cfg_min) {
            let cfg_ms = cfg_min.markups !== undefined ? cfg_min.markups : {};
            if (cfg_ms) {
                if (cli_min === undefined && (
                    cfg_ms.htmlmin || cfg_ms.htmlmin === undefined))
                {
                    htmlmin = extend({
                        collapseWhitespace: true,
                        minifyCSS: true,
                        minifyJS: true,
                        removeComments: true
                    }, cfg_ms.htmlmin);
                }
            }
        }
    }

    let argv = require('yargs')
        .default('htmlmin', htmlmin).argv;
    if (typeof argv.htmlmin === 'string') {
        argv.htmlmin = JSON.parse(argv.htmlmin);
    }

    let stream = gulp.src([
        'src/**/*.html'
    ]);
    if (argv.htmlmin) {
        stream = stream.pipe(gulp_htmlmin.apply(
            this, [extend({
                collapseWhitespace: true,
                minifyCSS: true,
                minifyJS: true,
                removeComments: true
            }, argv.htmlmin)]
        ));
    }
    stream = stream.pipe(gulp.dest(
        path.join('build', pkg.name)
    ));
    return stream;
});
