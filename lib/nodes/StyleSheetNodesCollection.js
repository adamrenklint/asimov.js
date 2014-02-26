/*

  style sheet nodes collection class

*/

define([

  '../core/FilesystemCollection',
  './StyleSheetNode'

], function (FilesystemCollection, StyleSheetNode) {

  var _super = FilesystemCollection.prototype;

  return FilesystemCollection.extend({

    'namespace': 'StyleSheets',

    'filetype': 'styleSheet',
    'extension': 'styl',

    'model': StyleSheetNode
  });
});