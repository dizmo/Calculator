let pkg = require('../../../package.js'),
    path = require('path');
let gulp = require('gulp'),
    gulp_uglify = require('gulp-uglify'),
    gulp_sourcemaps = require('gulp-sourcemaps');
let babelify = require('babelify'),
    buffer = require('vinyl-buffer'),
    browserify = require('browserify'),
    extend = require('xtend'),
    source = require('vinyl-source-stream'),
    through = require('through2');

function ensure(package, callback) {
    require('fs').access(
        './node_modules/' + package, function (error)
    {
        if (error) {
            let npm_install = require('child_process').spawn('npm', [
                'install', package
            ], {
                shell: true, stdio: 'ignore'
            });
            npm_install.on('exit', function () {
                callback(require(package));
            });
        } else {
            callback(require(package));
        }
    });
}

function gulp_obfuscator(options) {
    return through.obj(function (file, encoding, callback) {
        if (file.isNull()) {
            return callback(null, file);
        }
        if (file.isStream()) {
            return callback(new Error('streaming not supported', null));
        }
        ensure('javascript-obfuscator', function (obfuscator) {
            let result = obfuscator.obfuscate(
                file.contents.toString(encoding), options);
            file.contents = Buffer.from(
                result.getObfuscatedCode(), encoding);
            callback(null, file);
        });
    });
}

gulp.task('scripts', function () {
    let cli_min = require('yargs')
        .default('minify')
        .argv.minify;

    let sourcemaps = false,
        obfuscate = false,
        uglify = cli_min === true
            ? { keep_fnames: true }
            : false;

    if (pkg.dizmo && pkg.dizmo.build) {
        let cfg_min = pkg.dizmo.build.minify;
        if (cfg_min) {
            let cfg_ss = cfg_min.scripts !== undefined ? cfg_min.scripts : {};
            if (cfg_ss) {
                if (cfg_ss.sourcemaps) // by default w/o a source-map!
                {
                    sourcemaps = extend({loadMaps: true}, cfg_ss.sourcemaps);
                }
                if (cli_min === undefined && (
                    cfg_ss.obfuscate || cfg_ss.obfuscate === undefined))
                {
                    obfuscate = extend({}, cfg_ss.obfuscate);
                }
                if (cli_min === undefined && (
                    cfg_ss.uglify || cfg_ss.uglify === undefined))
                {
                    uglify = extend({}, cfg_ss.uglify);
                }
            }
        }
    }

    let argv = require('yargs')
        .default('sourcemaps', sourcemaps)
        .default('obfuscate', obfuscate)
        .default('uglify', uglify).argv;

    if (typeof argv.sourcemaps === 'string') {
        argv.sourcemaps = JSON.parse(argv.sourcemaps);
    }
    if (typeof argv.obfuscate === 'string') {
        argv.obfuscate = JSON.parse(argv.obfuscate);
    }
    if (typeof argv.uglify === 'string') {
        argv.uglify = JSON.parse(argv.uglify);
    }

    let browserified = browserify({basedir: '.', entries: [
        'node_modules/@babel/polyfill/dist/polyfill.js', 'src/index.js'
    ]}).transform(babelify);

    let stream = browserified.bundle()
        .pipe(source('index.js')).pipe(buffer());
    if (argv.sourcemaps) {
        stream = stream.pipe(gulp_sourcemaps.init(
            extend({loadMaps: true}, argv.sourcemaps)
        ));
    }
    if (argv.obfuscate || argv.obfuscate === undefined) {
        stream = stream.pipe(gulp_obfuscator.apply(
            this, [extend({}, argv.obfuscate)]
        ));
    }
    if (argv.uglify || argv.uglify === undefined) {
        stream = stream.pipe(gulp_uglify.apply(
            this, [extend({}, argv.uglify)]
        ));
    }
    if (argv.sourcemaps) {
        stream = stream.pipe(gulp_sourcemaps.write(
            './'
        ));
    }
    stream = stream.pipe(gulp.dest(
        path.join('build', pkg.name)
    ));
    return stream;
});
