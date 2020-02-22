// Karma configuration
// Generated on Wed Apr 12 2017 14:25:54 GMT+0530 (India Standard Time)
/* global module */

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      '../www/lib/angular/angular.js',
      '../www/lib/ionic/js/ionic.bundle.js',
      '../www/lib/angular-animate/angular-animate.js',
      '../www/lib/angular-sanitize/angular-sanitize.js',
      '../www/lib/ngCordova/dist/ng-cordova.js',
      '../www/lib/highcharts/highcharts.js',
      '../www/lib/highcharts/highcharts-more.js',
      '../www/lib/highcharts/modules/solid-gauge.js',
      '../www/lib/highcharts/modules/no-data-to-display.js',
      '../www/lib/angularjs-slider/dist/rzslider.min.js',
      '../www/lib/angular-base64-upload/dist/angular-base64-upload.min.js',
      // '../www/lib/markerwithlabel/src/markerwithlabel.js',
      '../www/lib/moment/moment.js',
      '../www/lib/angular-moment/angular-moment.min.js',
      '../www/lib/ionic-datepicker/dist/ionic-datepicker.bundle.min.js',
      '../www/lib/ti-segmented-control/dist/ti-segmented-control.js',
      '../www/lib/ngstorage/ngStorage.js',

      '../www/js/*.js',
      '../www/js/Common/Constants.js',
      '../www/js/Common/Directives/DonutChartDirective.js',
      '../www/js/Common/Login/LoginController.js',
      '../www/js/Common/Login/LoginService.js',
      '../www/js/Utilities/RestClient.js',
      '../www/js/**/*.js',
      '../www/js/**/**/*.js',
      // '../www/js/app.js',

      '../www/lib/angular-mocks/angular-mocks.js',
      '**/*tests.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'kjhtml'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  });
};
