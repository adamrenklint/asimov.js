/*

  script template helper class

*/

define([

  '../render/TemplateHelper',
  '../nodes/ScriptNode',
  'path',
  'lodash'

], function (TemplateHelper, ScriptNode, npath, _) {

  var _super = TemplateHelper.prototype;

  return TemplateHelper.extend({

    'run': function (name) {

      var self = this;
      var options = self.opts(arguments);
      var collection = self.options.scripts;
      var hash = options.hash;

      self.assert('string', name, 'Invalid name in script template helper @ ' + self.currentUrl);

      name = 'lib/scripts/' + name;

      var model = collection.find(function (_model) {
        return _model.attributes.name === name;
      });

      if (!model) {

        model = collection.create({
          'name': name
        }, self.options);

        self.defer(model.fetch);
      }

      var attributes = model.attributes;

      hash.rel = attributes.type.toLowerCase();
      hash.type = attributes.contentType;
      hash.src = attributes.url;

      return self.html('script', hash);
    }
  });
});