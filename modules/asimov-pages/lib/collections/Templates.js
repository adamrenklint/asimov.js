var FileCollection = require('asimov-collection').FileCollection;
var Template = require('../models/Template');
var _super = FileCollection.prototype;

module.exports = FileCollection.extend({

  'filetype': 'template',
  'extension': 'tmpl',

  'model': Template,

  'namespace': 'pages'
});
