let child_process = require('child_process'),
    fs = require('fs');

let run_script = function () {
    child_process.spawn('node', [
        './node_modules/gulp/bin/gulp.js', 'watch'
    ].concat(process.argv.slice(2)), {
        shell: true, stdio: 'inherit'
    });
};

fs.access('./node_modules', function (error) {
    if (error) {
        let Spinner = require('../miscellanea/cli-spinner').Spinner,
            spinner = new Spinner('%s installing dependencies: .. ');
        let npm_install = child_process.spawn('npm', [
            'install'
        ], {
            shell: true, stdio: 'ignore'
        });
        npm_install.on('exit', function () {
            spinner.stop(true);
            run_script();
        });
        spinner.start();
    } else {
        run_script();
    }
});
