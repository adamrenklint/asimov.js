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
  //middleware sequence will be added by server module

  inits.forEach(function (name) {
    if (options[name] === false) return;
    asimov.init(getInit(name));
  });

  asimov.postinit(getInit('fetch'));

  asimov.use(require('../asimov-helpers'));
};

// exports.Page = require('./lib/models/Page');
