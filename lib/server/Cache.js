/*
  
  cache class

  holds all the cached assets and the information about them
  allows manipulation of cache collection

*/

define([

  '../core/Base',
  'lodash'

], function (Base, _) {

  var _super = Base.prototype;
  
  return Base.extend({

    'namespace': 'Cache',

    'initialize': function (options) {

      var self = this;
      _super.initialize.apply(self, arguments);

      self.cache = {};
      self.waiting = {};

      self.loggers = {
        'existing': null,
        'adding': null
      };
    },

    'set': function (url, type, content) {

      var self = this;
      var existing = !!self.cache[url];

      self.cache[url] = {
        'type': type,
        'content': content
      };

      if (existing) {

        if (!self.loggers.existing || self.loggers.existing.isDone) {
          self.loggers.existing = self.logger.wait(self.namespace, 'Updating 0 url(s)', false);
        }

        self.loggers.existing.nextAndDone();

        // self.options.logVerbose && self.logger.info(self.namespace, 'Updating ' + type + ' @ ' + url);
        self.trigger('updated', url, content);
      }
      else {

        if (!self.loggers.adding || self.loggers.adding.isDone) {
          self.loggers.adding = self.logger.wait(self.namespace, 'Adding 0 new url(s)', false);
        }

        self.loggers.adding.nextAndDone();
        
        self.options.logVerbose && self.logger.info(self.namespace, 'Adding new ' + type + ' @ ' + url);
        self.trigger('added', url, content);
      }

      self.flushWaiting(url);
    },

    'find': function (url, res) {

      var self = this;
      var existing = self.cache[url];

      if (existing) {

        self.options.logVerbose && self.logger.info(self.namespace, 'Cached ' + existing.type + ' found @ ' + url);
        self.trigger('found', url, existing, res);
      }
      else {

        self.options.logVerbose && self.logger.info(self.namespace, 'No cached content @ ' + url);
        self.notFound(url, res);
      }
    },

    'notFound': function (url, res) {

      var self = this;

      if (!self.waiting[url]) {
        self.waiting[url] = [];
      }

      self.waiting[url].push(res);

      self.trigger('notFound', url, res);
    },

    'flushWaiting': function (url) {

      var self = this;
      if (self.waiting[url]) {

        var existing = self.cache[url];

        _.each(self.waiting[url], function (res) {
          self.trigger('found', existing, res);
        });
      }
    }
  });
});