/*

  queue class

  keeps track of the assets to render or bundle
  can push item to front of queue

*/

define([

  '../core/Collection',
  './RenderJob',
  'lodash'

], function (Collection, RenderJob, _) {

  var _super = Collection.prototype;

  return Collection.extend({

    'namespace': 'queue',

    'renderCosts': {
      'page': 4,
      'styleSheet': 20,
      'script': 55
    },

    'initialize': function () {

      var self = this;
      _super.initialize.apply(self, arguments);

      self.jobs = [];
      self.pending = [];
      self.limit = 100;
      self.delay = 10;

      self.renderer = new RenderJob(self.options);

      self.bindTo(self.mediator, 'queue:start', self.start);
    },

    'start': function () {

      var self = this;
      if (!self.started) {

        self.started = true;

        self.render();
      }
    },

    'stop': function () {

      var self = this;

      if (self.loopTimeout) {
        clearTimeout(self.loopTimeout);
      }
    },

    'getNextBatch': function () {

      var self = this;
      var limit = self.limit;
      var models = [];
      var index = 0;
      var model, type, cost, firstType;

      while (limit) {

        model = self.models[index];
        index++;

        if (model) {

          type = model.attributes.type;
          firstType = firstType || type;

          cost = self.renderCosts[type] || 1;
          cost = cost > self.limit ? self.limit : cost;

          if (cost <= limit && type === firstType) {
            models.push(model);
            limit = limit - cost;
          }
        }
        else {
          limit = 0;
        }
      }

      self.remove(models);

      return models;
    },

    'render': function () {

      var self = this;
      var delay = self.delay;
      var started = new Date();

      var models = self.getNextBatch();
      var size = models.length;
      var promises = [];

      if (!size) {

        self.loopTimeout = _.delay(self.render, 1000);
        return;
      }

      var job, attributes;

      while (size--) {

        job = models.shift();
        attributes = job.attributes;

        promises.push(self.renderer.run(job));
      }

      self.when.call(self, promises).done(function () {

        var models = _.flatten(_.toArray(arguments));
        _.each(models, function (model) {
          self.trigger('processed', model);
        });

        var groups = _.sortBy(models, function (model) {
          return model.attributes.type;
        });

        var logString = 'Processed ' + models.length + ' ' + models[0].attributes.type + ' job(s)';
        self.logger.since(self.namespace, logString, started);

        if (!self.models.length) {
          self.mediator.trigger('queue:empty');
        }
      }).fail(function () {

        throw new Error('Failed to complete ' + job.attributes.type + ' render batch');
      });

      self.loopTimeout = _.delay(self.render, delay);
    },

    // 'prio': function (url, response) {

    //   var self = this;
    //   var logger = self.logger.wait(self.namespace, 'Processing priority job in queue @ ' + url);

    //   var job = self.get(url);
    //   self.remove(job);

    //   job.logger = logger;

    //   self.renderer.run(job).done(function () {
    //     var models = _.flatten(_.toArray(arguments));
    //     _.each(models, function (model) {
    //       self.trigger('processed', model);
    //     });
    //   });
    // }
  });
});