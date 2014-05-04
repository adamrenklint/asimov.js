var Pages = require('../collections/Pages');
var StyleSheets = require('../collections/StyleSheets');
var Scripts = require('../collections/Scripts');
var Templates = require('../collections/Templates');

module.exports = function (next, asimov) {

  asimov.register('templates', new Templates());
  asimov.register('pages', new Pages());
  asimov.register('styles', new StyleSheets());
  asimov.register('scripts', new Scripts());

  next();
};
