module.exports = {
  default: {
    require: [
      'test/features/support/**/*.js',
      'test/features/steps/**/*.js'
    ],
    formatOptions: { snippetInterface: 'async-await' }
  }
};
