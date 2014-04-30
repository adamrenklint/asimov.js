var FilesystemCollection = require('../core/FilesystemCollection');
var StyleSheetNode = require('./StyleSheetNode');
var _super = FilesystemCollection.prototype;

module.exports = FilesystemCollection.extend({

  'filetype': 'styleSheet',
  'extension': 'styl',

  'model': StyleSheetNode
});