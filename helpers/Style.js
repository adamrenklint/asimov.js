/*
  
  ▲ asimov.js style sheet template helper class

  registers stylesheet to render queue and and inserts
  code that loads it on the client side, unless already loaded

*/

define([

  '../lib/render/TemplateHelper',
  'lodash'

], function (TemplateHelper, _) {

  var _super = TemplateHelper.prototype;

  return TemplateHelper.extend({

    'run': function (name) {

      var self = this;
      var options = self.opts(arguments);
      var url = name.indexOf(self.options.paths.frameworkStyles) < 0 ? '/site/styles/' + name : '/' + name;
      url += '.css';

      var hash = options.hash;

      var styles = {
        'nodeType': 'styleSheet',
        'name': name,
        'url': url
      };

      if (!self.options.map[url]) {
        self.vent('queue', styles);
        self.options.map[url] = styles;
      }

      hash.rel = 'stylesheet';
      hash.type = 'text/css';
      hash.selfClose = true;
      hash.href = url;

      return self.html('link', hash);
    }
  });
});