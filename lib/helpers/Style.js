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
      var collection = self.options.styleSheets;
      var hash = options.hash;

      var model = collection.create({
        'name': name
      });
      var attributes = model.attributes;

      hash.rel = attributes.type.toLowerCase();
      hash.type = attributes.contentType;
      hash.selfClose = true;
      hash.href = attributes.url;

      model.fetch();

      return self.html('link', hash);
    }
  });
});