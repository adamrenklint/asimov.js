/*

  site data collection class

  loads the arbitrary data files

*/

define([

  './Base',
  '../nodes/MetaNode',
  'lodash',
  'path'

], function (Base, MetaNode, _, npath) {

  var _super = Base.prototype;

  return Base.extend({

    'namespace': 'Data',

    'initialize': function (options) {

      var self = this;
      _super.initialize.apply(self, arguments);

      self.json = self.generate();
    },

    'generate': function () {

      var self = this;
      var path = npath.join(process.cwd(), self.options.paths.data);
      var configs = {};

      self.filesystem.readDirectory(path, function (subpath, filename) {

        if (self.filesystem.hasFileExtension(filename, 'txt')) {

          var log = self.logger.wait(self.namespace, 'Loading site data @ ' + subpath);

          var name = filename.replace('.txt', '');

          var node = new MetaNode(_.merge(self.options, {
            'nodePath': subpath
          }));

          configs[name] = node.meta;

          log.nextAndDone();
        }
      });

      return configs;
    }
  });
});