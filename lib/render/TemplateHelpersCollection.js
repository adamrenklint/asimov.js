var FilesystemCollection = require('../core/FilesystemCollection');
var TemplateHelperModel = require('./TemplateHelperModel');
var _super = FilesystemCollection.prototype;

module.exports = FilesystemCollection.extend({

  'filetype': 'template helper',
  'extension': 'js',

  'model': TemplateHelperModel
});