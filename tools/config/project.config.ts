import { join } from 'path';

import { SeedConfig } from './seed.config';
// import { ExtendPackages } from './seed.config.interfaces';

/**
 * This class extends the basic seed configuration, allowing for project specific overrides. A few examples can be found
 * below.
 */
export class ProjectConfig extends SeedConfig {

  PROJECT_TASKS_DIR = join(process.cwd(), this.TOOLS_DIR, 'tasks', 'project');

  constructor() {
    super();
    this.APP_TITLE = 'Ge.I.T Games';
    // this.GOOGLE_ANALYTICS_ID = 'Your site's ID';

    /* Enable typeless compiler runs (faster) between typed compiler runs. */
    // this.TYPED_COMPILE_INTERVAL = 5;

    // Add `NPM` third-party libraries to be injected/bundled.
    this.NPM_DEPENDENCIES = [
      ...this.NPM_DEPENDENCIES,
      // {src: 'jquery/dist/jquery.min.js', inject: 'libs'},
      // {src: 'lodash/lodash.min.js', inject: 'libs'},
    ];

    // Add `local` third-party libraries to be injected/bundled.
    this.APP_ASSETS = [
      {src: `${this.APP_SRC}/games_lib/libs/phaser.min.js`, inject: true, vendor: false}
      // {src: `${this.CSS_SRC}/path-to-lib/test-lib.css`, inject: true, vendor: false},
    ];

    this.ROLLUP_INCLUDE_DIR = [
      ...this.ROLLUP_INCLUDE_DIR,
      //'node_modules/moment/**'
    ];

    this.ROLLUP_NAMED_EXPORTS = [
      ...this.ROLLUP_NAMED_EXPORTS,
      //{'node_modules/immutable/dist/immutable.js': [ 'Map' ]},
    ];
    this.addPackageBundles({
      name: 'firebase',
      path: 'node_modules/firebase',
      packageMeta: {
        main: 'firebase.js',
        defaultExtension: 'js'
      }
    });
    // this.addPackageBundles({
    //   name: '@ng-bootstrap/ng-bootstrap',
    //   path: 'node_modules/@ng-bootstrap/ng-bootstrap/bundles/',
    //   packageMeta: {
    //     main: 'ng-bootstrap.js',
    //     defaultExtension: 'js'
    //   }
    // });
    this.addPackageBundles({
      name: 'ng2-cookies',
      path: 'node_modules/ng2-cookies/',
      packageMeta: {
        main: 'index.js',
        defaultExtension: 'js'
      }
    });
    this.addPackageBundles({
      name: 'ngx-img-cropper',
      path: 'node_modules/ngx-img-cropper/',
      packageMeta: {
        main: 'index.js',
        defaultExtension: 'js'
      }
    });
    // Add packages (e.g. ng2-translate)
    // const additionalPackages: ExtendPackages[] = [{
    //   name: 'ng2-translate',
    //   // Path to the package's bundle
    //   path: 'node_modules/ng2-translate/bundles/ng2-translate.umd.js'
    // }];
    //
    // this.addPackagesBundles(additionalPackages);

    /* Add proxy middleware */
    // this.PROXY_MIDDLEWARE = [
    //   require('http-proxy-middleware')('/api', { ws: false, target: 'http://localhost:3003' })
    // ];

    /* Add to or override NPM module configurations: */
    // this.PLUGIN_CONFIGS['browser-sync'] = { ghostMode: false };
  }

}
