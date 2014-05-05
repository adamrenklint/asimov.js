var asimov = require('../../../../index');

var Collection = require('asimov-collection').Collection;
var RenderJob = require('./RenderJob');
var _ = require('lodash');
var _super = Collection.prototype;

module.exports = Collection.extend({

  'namespace': 'queue',

  'renderCosts': {
    'page': 5,
    'styleSheet': 20,
    'script': 30
  },

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);

    self.jobs = [];
    self.pending = [];
    self.limit = 100;
    self.delay = 10;

    self.renderer = new RenderJob(self.options);
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

      self.logger.low(self.namespace, 'Rendering ' + attributes.type + ' @ ' + attributes.url);

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

      var logString = 'Processed ' + models.length + ' ' + models[0].attributes.type + '(s)';
      self.logger.since(self.namespace, logString, started);

      if (!self.models.length) {
        asimov.trigger('queue:empty');
      }
    }).fail(function () {

      throw new Error('Failed to complete ' + job.attributes.type + ' render batch');
    });

    self.loopTimeout = _.delay(self.render, delay);
  }
});
