/*
  
  ▲ asimov.js application template helper class

  registers application from template to render queue
  and inserts code to load application on client side

*/

define([

  '../lib/render/TemplateHelper',
  '../lib/core/Filesystem',
  'lodash'

], function (TemplateHelper, Filesystem, _) {

  var _super = TemplateHelper.prototype;
  var filesystem = new Filesystem();

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
      self.options.map[url] = app;

      return app;
    },

    'run': function (name) {

      var self = this;
      var options = self.opts(arguments);
      var url = self.getUrl(name);

      if (!filesystem.pathExists('public' + url)) {
        throw new Error('Cannot find application ' + name + ' @ ' + url);
      }

      if (!self.options.map[url]) {

        self.queueApp(name, url);
      }

      return self.html('script', {
        'src': url
      });
    }
  });
});