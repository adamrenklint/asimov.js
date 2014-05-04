var npath = require('path');

module.exports = function (next, asimov) {

  asimov.helpersPath(npath.join(__dirname, '../helpers'), 'helpers');

  next();
};
