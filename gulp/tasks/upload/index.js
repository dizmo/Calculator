let pkg = require('../../package.js'),
    fs = require('fs');

let assert = require('assert'),
    request = require('request');
let gulp = require('gulp'),
    gulp_util = require('gulp-util');

gulp.task('upload:send', function (done) {
    let host = process.env.DZM_STORE_HOST,
        user = process.env.DZM_STORE_USER,
        pass = process.env.DZM_STORE_PASS;

    if (pkg.dizmo && pkg.dizmo.store) {
        host = host || pkg.dizmo.store.host;
        user = user || pkg.dizmo.store.user;
        pass = pass || pkg.dizmo.store.pass;
    }

    let argv = require('yargs')
        .default('host', host)
        .default('user', user)
        .default('pass', pass)
        .default('publish', null)
        .argv;

    if (!argv.host) {
        setTimeout(function () {
            gulp_util.log(gulp_util.colors.yellow.bold(
                'Upload: DZM_STORE_HOST, package.json:dizmo.store.host or ' +
                '`--host` required!'
            ));
        }, 0);
        done(); return;
    }
    if (!argv.user && argv.user !== '') {
        setTimeout(function () {
            gulp_util.log(gulp_util.colors.yellow.bold(
                'Upload: DZM_STORE_USER, package.json:dizmo.store.user or ' +
                '`--user` required!'
            ));
        }, 0);
        done(); return;
    }
    if (!argv.pass && argv.pass !== '') {
        setTimeout(function () {
            gulp_util.log(gulp_util.colors.yellow.bold(
                'Upload: DZM_STORE_PASS, package.json:dizmo.store.pass or ' +
                '`--pass` required!'
            ));
        }, 0);
        done(); return;
    }
    if (!pkg ||
        !pkg.dizmo ||
        !pkg.dizmo.settings ||
        !pkg.dizmo.settings['category'])
    {
        setTimeout(function () {
            gulp_util.log(gulp_util.colors.yellow.bold(
                'Upload: package.json:dizmo.settings.category required, ' +
                'e.g. "tools"!'
            ));
        }, 0);
        done(); return;
    }

    let dzm_name = '{0}-{1}.dzm'
        .replace('{0}', pkg.name)
        .replace('{1}', pkg.version);

    let do_login = function () {
        request.post(argv.host + '/v1/oauth/login',
            {
                body: JSON.stringify({
                    username: argv.user, password: argv.pass
                }),
                headers:{
                    'Content-Type': 'application/json'
                }
            }, on_login
        );
    };
    let on_login = function (err, res) {
        if (!err && res.statusCode === 200) {
            let set_cookies = res.headers['set-cookie'];
            assert(set_cookies, '"Set-Cookie" header required');
            let set_cookie = set_cookies[0];
            assert(set_cookie, '"Set-Cookie" header empty');
            let session = set_cookie.split(';')[0];
            assert(session, '"Set-Cookie" header invalid');

            if (argv.publish === true) {
                publish_dizmo(session);
            } else {
                post_dizmo(session);
            }
        } else {
            on_error_login.apply(this, arguments);
        }
    };
    let post_dizmo = function (session) {
        if (argv.publish === true) {
            publish_dizmo(session);
        } else {
            request.post(argv.host + '/v1/dizmo',
                {
                    formData: {
                        file: fs.createReadStream('build/' + dzm_name)
                    },
                    headers:{
                        'Cookie': session
                    }
                }, function (err, res) {
                    if (!err && res.statusCode === 201) {
                        setTimeout(function () {
                            gulp_util.log(gulp_util.colors.green.bold(
                                'Upload: transmission to {0} succeeded.'
                                    .replace('{0}', argv.host)
                            ));
                        }, 0);
                        publish_dizmo(session);
                    } else {
                        put_dizmo(session);
                    }
                }
            );
        }
    };
    let put_dizmo = function (session) {
        if (argv.publish === true) {
            publish_dizmo(session);
        } else {
            request.put(argv.host + '/v1/dizmo/{0}'
                    .replace('{0}', pkg.dizmo.settings['bundle-identifier']),
                {
                    formData: {
                        file: fs.createReadStream('build/' + dzm_name)
                    },
                    headers:{
                        'Cookie': session
                    }
                }, function (err, res) {
                    if (!err && res.statusCode === 200) {
                        setTimeout(function () {
                            gulp_util.log(gulp_util.colors.green.bold(
                                'Upload: transmission to {0} succeeded.'
                                    .replace('{0}', argv.host)
                            ));
                        }, 0);
                        publish_dizmo(session);
                    } else {
                        on_error_upload.apply(this, arguments);
                    }
                }
            );
        }
    };
    let publish_dizmo = function (session) {
        if (argv.publish !== false) {
            request.put(argv.host + '/v1/dizmo/{0}/publish/{1}'
                    .replace('{0}', pkg.dizmo.settings['bundle-identifier'])
                    .replace('{1}', pkg.version),
                {
                    body: JSON.stringify({
                        publish: true
                    }),
                    headers:{
                        'Content-Type': 'application/json',
                        'Cookie': session
                    }
                }, function (err, res) {
                    if (!err && res.statusCode === 200) {
                        setTimeout(function () {
                            gulp_util.log(gulp_util.colors.green.bold(
                                'Upload: publication of {0} succeeded.'
                                    .replace('{0}', dzm_name)
                            ));
                        }, 0);
                    } else {
                        on_error_publish.apply(this, arguments);
                    }
                }
            );
        }
    };

    let on_error_login = function () {
        setTimeout(function () {
            gulp_util.log(gulp_util.colors.yellow.bold(
                'Upload: sign-in to {0} failed!'.replace('{0}', argv.host)
            ));
        }, 0);
        on_error.apply(this, arguments);
    };
    let on_error_upload = function () {
        setTimeout(function () {
            gulp_util.log(gulp_util.colors.yellow.bold(
                'Upload: transmission to {0} failed!'
                    .replace('{0}', argv.host)
            ));
        }, 0);
        on_error.apply(this, arguments);
    };
    let on_error_publish = function () {
        setTimeout(function () {
            gulp_util.log(gulp_util.colors.yellow.bold(
                'Upload: publication of {0} failed!'
                    .replace('{0}', dzm_name)
            ));
        }, 0);
        on_error.apply(this, arguments);
    };
    let on_error = function (err, res, body) {
        if (err) {
            setTimeout(function () {
                gulp_util.log(gulp_util.colors.red.bold(
                    err, res.toJSON()
                ));
            }, 0);
        } else if (body) {
            try {
                let json = JSON.parse(body);
                if (json.errormessage && json.errornumber) {
                    setTimeout(function () {
                        gulp_util.log(gulp_util.colors.yellow.bold('{0} [{1}]'
                            .replace('{0}', json.errormessage)
                            .replace('{1}', json.errornumber)
                        ));
                    }, 0);
                } else {
                    setTimeout(function () {
                        gulp_util.log(gulp_util.colors.yellow.bold(
                            JSON.stringify(json, null, 4)
                        ));
                    }, 0);
                }
            } catch (ex) {
                setTimeout(function () {
                    gulp_util.log(gulp_util.colors.red.bold(
                        body
                    ));
                }, 0);
            }
        } else {
            setTimeout(function () {
                gulp_util.log(gulp_util.colors.red.bold(
                    res.toJSON()
                ));
            }, 0);
        }
    };
    do_login();
});

gulp.task('upload', gulp.series(
    'build', 'upload:send'
));
