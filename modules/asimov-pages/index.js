function getInit (name) {
  return require('./lib/init/' + name);
}

var inits = [
  'collections',
  'methods',
  'paths',
  'render',
  'watch'
];

module.exports = function (asimov, options) {

  options = options || {};
  asimov.config.paths.outputPath = options.outputPath || (process.cwd() + '/build');

  asimov.addSequence('processor');
  console.log(asimov.processor)

  inits.forEach(function (name) {
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
