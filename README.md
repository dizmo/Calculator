# Calculator dizmo

Create the `calculator` dizmo by running `npm run build` and drag and drop the generated file &ndash; which can be found at `build/calculator-x.y.z.dzm` &ndash; onto dizmoViewer. The suffix of the file will be the current version number.

## Building

> Before running any build script, please ensure that `npm install` has been executed, and that the dependencies beneath `node_modules` are up to date!

Building the dizmo requires a sequence of tasks to be run, which are:

* `npm run clean`: Cleans the previous build (if any) by removing the `build/` folder completely.

* `npm run build`: Packages the dizmo as `build/calculator-x.y.z.dzm` by running all required build tasks and compressing the resulting dizmo as a ZIP archive (but with a `.dzm` extension). Runs if required also `npm install`.

* `npm run deploy`: Builds and deploys the dizmo to the path specified by the `dizmo/deploy-path` entry (in `package.json` or in `~/.generator-dizmo/config.json`) or specified by the `DZM_DEPLOY_PATH` environment variable. If neither `dizmo/deploy-path` nor `DZM_DEPLOY_PATH` are set, then the dizmo is only built, but not deployed.

If any of these steps should fail -- due to missing dependencies -- then please run `npm install` to have them fetched and installed locally.

## Watching

You may want to automatically build and deploy your dizmo, whenever a change is applied. This is possible by running the `watch` run-script in a separate terminal:

    npm run watch

Now, any change in the current directory (except in `build/` and `node_modules/`) will trigger a `deploy`, which is equivalent to manually running:

    npm run deploy

## Testing

By default no test cases nor a test framework are pre-defined:

* `npm run test`: Runs tests (if any) &ndash; but actually the script simply returns an `exit 0` indicating success. If desired, integrate your test framework of choice, write your test cases and override the `test` script in `package.json` accordingly.

  The only requirement is that the main test script should return `0` in case of a successful test run.

## Configuration

The `dizmo` section in `package.json` can be extended with default values, which have to reside in `.generator-dizmo/config.json` (in *any* of the parent directories). For example, to set the credentials and the upload URL for the standard dizmoStore, use the following content:

    {
        "dizmo": {
            "deploy-path": "..", "store": {
                "host": "https://store-api.dizmo.com",
                "user": "..",
                "pass": ".."
            }
        }
    }

The configuration is hierarchical and recursive, i.e. that a `.generator-dizmo/config.json` file can be saved in any parent directory of the current project's path, all of which are then merged during the build dynamically into `package.json`. Configuration files in the lower levels have precedence.

## Upload

Dizmo offers a *dizmoStore* where dizmos can be uploaded to: Besides `package.json` (or `.generator-dizmo/config.json`) or environment variables, upload arguments like the *host* and *user* name plus *password* can also be provided via the CLI:
```
npm run upload -- --host=https://store-api.dizmo.com --user='..' --pass='..'
```

## Versioning

**Important:** Please use semantic versioning by applying `npm version patch` for small patches, `npm version minor` for minor and `npm version major` for major changes! See [NPM's semantic versioning](https://docs.npmjs.com/getting-started/semantic-versioning) for further information.
