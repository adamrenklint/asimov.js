/*

  ▲ cli preview action class

  runs asimov.js on template directory

*/

define([

  './Action',
  'path',
  '../core/Loader'

], function (Action, path, Loader) {

  var _super = Action.prototype;

  return Action.extend({

    'initialize': function () {

      var self = this;
      _super.initialize.apply(self, arguments);
    },

    'run': function (options) {

      var self = this;
      options = options || {};

      options.frameworkDir = options.frameworkDir || 'node_modules/asimov-framework';
      options.pkg = self.filesystem.readJSON(self.options.baseDir + '/package.json');

      options.meta = {
        'name': self.options.args.name,
        'version': '1993'
      };

      options.environment = 'preview';

      var app = new Loader(options);
    }
  });
});