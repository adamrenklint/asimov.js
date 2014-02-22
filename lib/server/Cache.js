/*

  cache class

  holds all the cached assets and the information about them
  allows manipulation of cache collection

*/

define([

  '../core/Collection',
  'lodash'

], function (Collection, _) {

  var _super = Collection.prototype;

  return Collection.extend({

    'namespace': 'Cache',

    'initialize': function (options) {

      var self = this;
      _super.initialize.apply(self, arguments);

      self.waiting = {};

      self.loggers = {
        'existing': null,
        'adding': null
      };
    },

    'add': function (model) {

      var self = this;
      var url = model.attributes.url;
      var existing = self.get(url);

      if (existing) {

        if (!self.loggers.existing || self.loggers.existing.isDone) {
          self.loggers.existing = self.logger.wait(self.namespace, 'Updating 0 url(s)', false);
        }

        self.loggers.existing.nextAndDone();

        self.options.logVerbose && self.logger.info(self.namespace, 'Updating ' + model.attributes.type + ' @ ' + url);
        self.trigger('updated', model);
      }
      else {

        if (!self.loggers.adding || self.loggers.adding.isDone) {
          self.loggers.adding = self.logger.wait(self.namespace, 'Adding 0 new url(s)', false);
        }

        self.loggers.adding.nextAndDone();

        self.options.logVerbose && self.logger.info(self.namespace, 'Adding new ' + model.attributes.type + ' @ ' + url);
        self.trigger('added', model);
      }

      _super.add.call(self, model);
      self.flushWaiting(url);
    },

    'find': function (url, res) {

      var self = this;
      var model = self.get(url);

      if (model) {

        self.options.logVerbose && self.logger.info(self.namespace, 'Cached ' + model.attributes.type + ' found @ ' + url);
        self.trigger('found', model, res);
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