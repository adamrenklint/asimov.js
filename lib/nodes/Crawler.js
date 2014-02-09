/*
  
  ▲ asimov.js crawler class

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
      self.map[node.url] = node;

      self.bindTo(node, 'changed', self.triggerUpdated);

      // And the children
      self.filesystem.readDirectory(path, self.readNode);

      return node;
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

        self.filesystem.watchTree(path, function (changed) {

          if (typeof changed === 'string') {

            var options = {
              'url': _.initial(changed.replace(path, '').split('/')).join('/') || '/'
            };
            PageNode.prototype.updatePosition.apply(options);

            var node = self.map[options.url];

            if (node) {
              node.updateMetaNode(changed);
            }
            else {
              throw new Error('Failed to find existing page node @ ' + options.url);
            }
          }
          else {

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
            done.resolve(self.map);
          }
        });
      });

      return done.promise();
    },

    'updateTemplate': function (templateName, templates) {

      var self = this;
      var changed = {};
      var logger = self.logger.wait('Templates', 'The template "' + templateName + '" was changed and invalidated 0 page(s)');
      var partial = '{{>' + templateName + '}}';

      _.each(self.map, function (node, url) {

        _.each(node.meta, function (meta, langCode) {

          if (templateName === meta.meta.template || templates[meta.meta.template].raw.indexOf(partial) >= 0) {
            changed[url] = node;
          }
        });
      });

      if (!_.size(changed)) {
        return logger.remove();
      }

      _.each(changed, function (node, url) {
        
        self.trigger('changed', node);
        logger.nextAndDone();
      });
    }
  });
});