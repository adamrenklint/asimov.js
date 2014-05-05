var paths = require('./lib/init/paths');

module.exports = function (asimov) {

  asimov.paths('helpers');
  // TODO: move all helpers related stuff here, also models and collections?
  asimov.init(paths);
};
