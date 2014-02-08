/*
  
  ▲ asimov.js page node class

  container of all page data,
  including a collection of translations

*/

define([

  '../core/Base',
  '../core/Filesystem',
  './MetaNode',
  'lodash'

], function (Base, Filesystem, MetaNode, _) {

  var _super = Base.prototype;

  var filesystem = new Filesystem();

  return Base.extend({

    'nodeType': 'page',

    'initialize': function (options) {

      var self = this;
      _super.initialize.apply(self, arguments);

      self.url = self.getUrl();
      
      self.meta = {};
      self.readMeta();

      self.updatePosition();
    },

    'updatePosition': function () {

      var self = this;
      var matches = self.url.match(/\/(\d)+-/);
      var match = matches && matches[0];

      if (match && typeof match === 'string') {
        
        var position = parseInt(match.replace('/', '').replace('-', ''), 10);

        if (typeof position === 'number') {
          self.url = self.url.replace(match, '/');
          self.position = position;
        }
      }
    },

    'getUrl': function () {

      var self = this;
      var options = self.options;
      var contentDir = options.paths.content;
      return options.nodePath.replace(contentDir, '') || '/';
    },

    'updateMetaNode': function (path) {

      var self = this;
      var options = _.clone(self.options);
      options.nodePath = path;

      var node = self.createMetaNode(options);

      self.trigger('changed', self);
    },

    'readMeta': function () {

      var self = this;
      var options = self.options;
      var path = options.nodePath;
      
      filesystem.readDirectory(path, function (subPath, filename) {

        if (filesystem.hasFileExtension(filename, 'txt')) {

          var options = _.clone(self.options);
          options.nodePath = subPath;

          self.createMetaNode(options);
        }
      });
    },

    'createMetaNode': function (options) {

      var self = this;
      var node = new MetaNode(options);

      self.meta[node.meta.langCode] = node;

      return node;
    }
  });
});