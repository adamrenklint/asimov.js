var FilesystemCollection = require('../core/FilesystemCollection');
var Template = require('./Template');
var _ = require('lodash');
var npath = require('path');
var _super = FilesystemCollection.prototype;

module.exports = FilesystemCollection.extend({

  'filetype': 'template',
  'extension': 'tmpl',

  'model': Template
});