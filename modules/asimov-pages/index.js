function getInit (name) {
  return require('./lib/init/' + name);
}

module.exports = function (asimov, options) {

  options = options || {};
  asimov.config.paths.outputPath = options.outputPath || (process.cwd() + '/build');

  ['pages', 'templates', 'siteData'].forEach(function (type) {
    asimov.paths(type);
  });

  [
    'preprocessor',
    'processor',
    'postprocessor'
  ].forEach(function (name) {
    asimov.addSequence(name);
  });

  [
    'collections',
    'paths',
    'render',
    'watch'
  ].forEach(function (name) {
    if (options[name] === false) return;
    asimov.init(getInit(name));
  });

  asimov.postinit(getInit('fetch'));

  asimov.use(require('../asimov-helpers'));
};

// Export public classes
[
  'models/Page'
].forEach(function (path) {

  var name = path.split('/').pop();
  module.exports[name] = require('./lib/' + path);
});
