var Pages = require('../collections/Pages');
var StyleSheets = require('../collections/StyleSheets');
var Scripts = require('../collections/Scripts');

var npath = require('path');

module.exports = function (next, asimov) {

  asimov.register('pages', new Pages());
  asimov.register('styles', new StyleSheets());
  asimov.register('scripts', new Scripts());

  next();
};
