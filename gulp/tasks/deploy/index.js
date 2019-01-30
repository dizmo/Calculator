let pkg = require('../../package.js'),
    fs = require('fs'),
    path = require('path');
let gulp = require('gulp'),
    gulp_util = require('gulp-util');

let to = function () {
    let deploy_path =
        process.env.DZM_DEPLOY_PATH || pkg.dizmo['deploy-path'];
    if (deploy_path && path.isAbsolute(deploy_path) === false) {
        deploy_path = path.join(process.cwd(), deploy_path);
    }
    if (deploy_path) {
        return path.join(
            deploy_path, pkg.dizmo.settings['bundle-identifier']);
    }
    return null;
};

let deploy = function (stream, to) {
    if (to) {
        stream.push(gulp.dest(to));
    }
    return stream;
};

gulp.task('deploy:copy', function (done) {
    let stream = deploy([gulp.src(
        'build/{0}/**/*'.replace('{0}', pkg.name)
    )], to());

    if (to() !== null) {
        setTimeout(function () {
            gulp_util.log(gulp_util.colors.green.bold(
                'Deployed to {0}.'.replace('{0}', to())
            ));
        }, 0);
        if (!fs.existsSync(to())) {
            stream[stream.length - 1].on('finish', function () {
                setTimeout(function () {
                    gulp_util.log(gulp_util.colors.green.bold(
                        'Drag-and-drop {0} onto dizmoViewer!'.replace(
                            '{0}', 'build/{0}-x.y.z.dzm'.replace(
                                '{0}', pkg.name
                            )
                        )
                    ));
                }, 0);
            });
        }
    } else {
        setTimeout(function () {
            gulp_util.log(gulp_util.colors.yellow.bold(
                'Neither the $DZM_DEPLOY_PATH environment variable nor the ' +
                '`dizmo/deploy-path` entry in package.json or ~/.generator-' +
                'dizmo/config.json have been set. Hence, the dizmo has not ' +
                'been deployed!'
            ));
            gulp_util.log(gulp_util.colors.yellow.bold(
                'It\'s recommended to set the $DZM_DEPLOY_PATH environment ' +
                'variable or the `dizmo/deploy-path` entry in ~/.generator-' +
                'dizmo/config.json to your dizmo deployment path.'
            ));
        }, 0);
    }
    if (stream.length > 1) {
        require('pump')(stream, done);
    } else {
        done();
    }
});

gulp.task('deploy', gulp.series(
    'build', 'deploy:copy'
));

gulp.task('deploy:only', function (done) {
    let stream = deploy([gulp.src(
        'build/{0}/**/*'.replace('{0}', pkg.name))
    ], to());
    if (stream.length > 1) {
        require('pump')(stream, done);
    } else {
        done();
    }
});
