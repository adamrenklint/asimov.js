var paths = require('./lib/init/paths');

module.exports = function (asimov) {

  asimov.paths('helpers');
  asimov.init(paths);
};
