/*
  
  ▲ asimov.js site data collection class

  loads the arbitrary data files

*/

define([

  './Base',
  './Filesystem',
  '../nodes/MetaNode',
  'lodash'

], function (Base, Filesystem, MetaNode, _) {

  var _super = Base.prototype;

  var filesystem = new Filesystem();

  return Base.extend({

    'namespace': 'Data',

    'initialize': function (options) {

      var self = this;
      _super.initialize.apply(self, arguments);

      self.json = self.generate();
    },

    'generate': function () {

      var self = this;
      var path = self.options.paths.data;
      var configs = {};

      filesystem.readDirectory(path, function (subpath, filename) {

        if (filesystem.hasFileExtension(filename, 'txt')) {

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