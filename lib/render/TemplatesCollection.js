/*

  templates collection class

  reads all templates and register partials

*/

define([

  '../core/FilesystemCollection',
  './Template',
  'lodash',
  'path'

], function (FilesystemCollection, Template, _, npath) {

  var _super = FilesystemCollection.prototype;

  return FilesystemCollection.extend({

    'filetype': 'template',
    'extension': 'tmpl',

    'model': Template
  });
});