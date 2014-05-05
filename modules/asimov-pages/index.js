function getInit (name) {
  return require('./lib/init/' + name);
}

module.exports = function (asimov, options) {

  options = options || {};
  asimov.config.paths.outputPath = options.outputPath || (process.cwd() + '/build');

  [
    'preprocessor',
    'processor',
    'postprocessor'
  ].forEach(function (name) {
    asimov.addSequence(name);
  });

  [
    'collections',
    'methods',
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
