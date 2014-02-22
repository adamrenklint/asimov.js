/*

  application template helper class

  registers application from template to render queue
  and inserts code to load application on client side

*/

define([

  '../render/TemplateHelper',
  'lodash'

], function (TemplateHelper, _) {

  var _super = TemplateHelper.prototype;

  return TemplateHelper.extend({

    'applications': {},

    'getUrl': function (name) {

      return '/applications/' + name + '/Application.js';
    },

    'queueApp': function (name, url) {

      var self = this;
      var app = {
        'nodeType': 'appBundle',
        'name': name,
        'url': url
      };

      self.vent('queue', app);
      self.map[url] = app;

      return app;
    },

    'run': function (name) {

      var self = this;
      var options = self.opts(arguments);
      var url = self.getUrl(name);

      if (!self.filesystem.pathExists('public' + url)) {
        throw new Error('Cannot find application ' + name + ' @ ' + url);
      }

      if (!self.map[url]) {

        self.queueApp(name, url);
      }

      return self.html('script', {
        'src': url
      });
    }
  });
});