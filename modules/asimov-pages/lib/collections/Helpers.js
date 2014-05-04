var FileCollection = require('asimov-collection').FileCollection;
var TemplateHelper = require('../models/TemplateHelper');
var _super = FileCollection.prototype;

module.exports = FileCollection.extend({

  'filetype': 'template helper',
  'extension': 'js',

  'model': TemplateHelper
});
