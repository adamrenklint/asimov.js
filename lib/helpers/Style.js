/*

  style sheet template helper class

  registers stylesheet to render queue and and inserts
  code that loads it on the client side, unless already loaded

*/

define([

  '../render/TemplateHelper',
  '../nodes/StyleSheetNode',
  'path',
  'lodash'

], function (TemplateHelper, StyleSheetNode, npath, _) {

  var _super = TemplateHelper.prototype;

  return TemplateHelper.extend({

    'run': function (name) {

      var self = this;
      var options = self.opts(arguments);
      var path, url;

      _.each(self.options.paths.styles, function (_path) {
        var stylePath = npath.join(_path, name + '.styl');
        if (self.filesystem.pathExists(stylePath)) {
          path = '/' + stylePath;
        }
      });

      // if (name.indexOf('asimov/') === 0) {
      //   var path = self.topio
      //   url = name.replace('asimov/', )
      // }
      // if (name.indexOf(self.options.paths.frameworkStyles) >= 0) {
      //   name = name.split(self.options.paths.frameworkStyles)[1];
      //   url = '/asimov.js' + name;
      // }

      url = path.replace('.styl', '.css');

      var hash = options.hash;

      var styles = {
        'name': name,
        'url': url,
        'path': path
      };

      self.requested = self.requested || {};

      if (!self.requested[url]) {

        var model = new StyleSheetNode(styles);
        self.options.queue.add(model);
        self.requested[url] = true;
      }

      hash.rel = 'stylesheet';
      hash.type = 'text/css';
      hash.selfClose = true;
      hash.href = url;

      return self.html('link', hash);
    }
  });
});