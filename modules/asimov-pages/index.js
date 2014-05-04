function getInit (name) {
  return require('./lib/init/' + name);
}

var inits = [
  'collections',
  'methods',
  'paths',
  'render',
  'watch',
  'fetch'
];

module.exports = function (asimov, options) {

  options = options || {};

  asimov.addSequence('processor');
  //middleware sequence will be added by server module

  inits.forEach(function (name) {
    if (options[name] === false) return;
    asimov.init(getInit(name));
  })
};

// exports.Page = require('./lib/models/Page');
