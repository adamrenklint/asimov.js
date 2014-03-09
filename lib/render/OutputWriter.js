/*

  output writer class

  writes the rendered raw data to disk,
  to be picked up by express' static middleware

*/

define([

  '../core/Base'

], function (Base) {

  var _super = Base.prototype;

  return Base.extend({

    'namespace': 'Output',

    'initialize': function () {

      var self = this;
      _super.initialize.apply(self, arguments);
    },

    'write': function (model) {

      var self = this;
      var attributes = model.attributes;
      var path = attributes.url;

      if (attributes.type === 'page') {
        path = (path + '/index.html').replace('//', '/');
      }

      path = self.options.outputPath + path;

      var logger = self.logger.wait(self.namespace, 'Writing ' + attributes.type + ' to static build folder @ ' + path);

      var parts = path.split('/');
      parts.pop();
      var parentPath = parts.join('/');
      self.filesystem.forceExists(parentPath);

      self.filesystem.writeFile(path, attributes.rendered);
      logger.nextAndDone();
    }
  });
});