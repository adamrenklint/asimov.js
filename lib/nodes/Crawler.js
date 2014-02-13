/*

  crawler class

  crawls content directory
  creates a content map of nodes

*/

define([

  '../core/Base',
  './PageNode',
  'lodash'

], function (Base, PageNode, _) {

  var _super = Base.prototype;

  return Base.extend({

    'namespace': 'Content',

    'initialize': function (options) {

      var self = this;
      _super.initialize.apply(self, arguments);

      self.map = {};
      self.paths = {};
      self.readCount = 0;
    },

    'readNode': function (path) {

      var self = this;

      if (!self.filesystem.isDirectory(path)) {
        return;
      }

      var options = _.clone(self.options);
      options.nodePath = path;
      var node = new PageNode(options);

      if (self.isHiddenPath(node.url)) {
        return;
      }

      self.map[node.url] = node;
      self.paths[node.url] = node.path;

      self.bindTo(node, 'changed', self.triggerUpdated);

      // And the children
      self.filesystem.readDirectory(path, self.readNode);
    },

    'update': function (s) {

      var self = this;
      console.log('sss>', s);process.exit(1);
    },

    'triggerUpdated': function (node) {

      var self = this;
      self.trigger('changed', node);
    },

    'crawl': function () {

      var self = this;
      var done = self.deferred();
      var path = self.options.contentPath;

      var crawling = self.logger.wait(self.namespace, 'Scanning content structure @ ' + path, true);

      self.readNode(path);

      _.defer(function () {

        var notFoundUrl = '/404';

        if (!self.map[notFoundUrl]) {

          var meta = {};
          meta[self.options.localization.defaultLangCode] = {
            'meta': {
              'template': '404'
            }
          };

          self.map[notFoundUrl] = {
            'nodeType': 'page',
            'url': notFoundUrl,
            'meta': meta
          };
        }

        _.each(self.map, function (node, url) {
          if (!node.meta[self.options.localization.defaultLangCode]) {
            delete self.map[url];
          }
        });

        crawling.done();
        done.resolve(self.map, self.paths);
      });

      return done.promise();
    }
  });
});