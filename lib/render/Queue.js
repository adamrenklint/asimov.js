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

    'namespace': 'Queue',

    'renderCosts': {
      'page': 4,
      'styleSheet': 20,
      'appBundle': 45
    },

    'initialize': function () {

      var self = this;
      _super.initialize.apply(self, arguments);

      self.jobs = [];
      self.pending = [];
      self.limit = 100;
      self.delay = 10;

      self.renderer = new RenderJob(self.options);

      self.bindTo(self.renderer, 'page:rendering', 'whenPageIsRendering');
      self.bindTo(self, 'add', 'logAdded');
    },

    'logAdded': function (model) {

      var self = this;
      var type = model.attributes.type;

      if (!self.addLog || self.addLog.isDone) {
        self.addLog = self.logger.wait(self.namespace, 'Adding 0 job(s) to queue');
      }

      self.addLog.nextAndDone();
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
      var model, type, cost;

      while (limit) {

        model = self.models[index];
        index++;

        if (model) {

          type = model.attributes.type;
          cost = self.renderCosts[type] || 1;
          cost = cost > self.limit ? self.limit : cost;

          if (cost <= limit) {
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

    'getProcessLogger': function (type) {

      var self = this;

      if (!self.processLoggers) {
        self.processLoggers = {};
      }

      if (!self.processLoggers[type] || self.processLoggers[type].isDone) {
          self.processLoggers[type] = self.logger.wait(self.namespace, 'Processing next 0 ' + type + ' job(s) in queue');
        }

      return self.processLoggers[type];
    },

    'render': function () {

      var self = this;
      var delay = self.delay;
      self.loggers = {};

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

        job.logger = self.getProcessLogger(attributes.type);
        promises.push(self.renderer.run(job));
      }

      self.when.call(self, promises).done(function () {

        var models = _.flatten(_.toArray(arguments));
        _.each(models, function (model) {
          self.trigger('processed', model);
        });

        if (!self.models.length) {
          self.trigger('empty');
        }
      });

      self.loopTimeout = _.delay(self.render, delay);
    },

    'prio': function (url, response) {

      var self = this;
      var logger = self.logger.wait(self.namespace, 'Processing priority job in queue @ ' + url);

      var job = self.get(url);
      self.remove(job);

      self.renderer.run(job).done(function () {
        var models = _.flatten(_.toArray(arguments));
        _.each(models, function (model) {
          self.trigger('processed', model);
        });
      });
    },

    'whenPageIsRendering': function (data) {

      var self = this;
      self.trigger('page:rendering', data);
    }
  });
});