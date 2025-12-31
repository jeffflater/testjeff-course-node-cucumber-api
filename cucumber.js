module.exports = {
  default: {
    paths: ['test/features/**/*.feature'],
    require: [
      'test/features/support/**/*.js',
      'test/features/steps/**/*.js'
    ],
    format: ['progress', 'html:reports/cucumber-report.html'],
    formatOptions: { snippetInterface: 'async-await' }
  }
};
