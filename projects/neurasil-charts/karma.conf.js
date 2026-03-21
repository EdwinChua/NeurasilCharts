// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

const path = require('path');
const MOCK_PATH = path.resolve(__dirname, 'src/chart-js.mock.js');

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageReporter: {
      dir: require('path').join(__dirname, '../../coverage/neurasil-charts'),
      reports: ['html', 'lcovonly', 'text-summary'],
      fixWebpackSourcePaths: true
    },
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-gpu']
      }
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    restartOnFileChange: true
  });

  // Use resolve.alias so webpack routes every import of 'chart.js' (and its
  // dist sub-paths) to a lightweight mock. This is more reliable than
  // NormalModuleReplacementPlugin for packages with conditional exports.
  if (config.buildWebpack && config.buildWebpack.webpackConfig) {
    const wpCfg = config.buildWebpack.webpackConfig;
    wpCfg.resolve = wpCfg.resolve || {};
    wpCfg.resolve.alias = wpCfg.resolve.alias || {};
    // Cover the three paths webpack may resolve 'chart.js' to:
    wpCfg.resolve.alias['chart.js'] = MOCK_PATH;
    wpCfg.resolve.alias['chart.js/dist/chart.js'] = MOCK_PATH;
    wpCfg.resolve.alias['chart.js/dist/chart.cjs'] = MOCK_PATH;
    // Also cover chartjs-plugin-datalabels which imports chart.js internally
    wpCfg.resolve.alias['chartjs-plugin-datalabels'] = false;
  }
};
