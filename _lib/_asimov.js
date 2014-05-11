
module.exports = function (options) {



  return bootstrap.getExports && bootstrap.getExports();
};

var paths = ['core/Base', 'middleware/Middleware', 'initializers/Initializer', 'helpers/Helper', 'commands/Command'];

if (process.env.ENV === 'test') {
  paths.push('runner/Test');
}

paths.forEach(function (loadPath) {
  var Constructor = require('./' + loadPath);
  var name = loadPath.split('/').pop();
  module.exports[name] = Constructor;
});