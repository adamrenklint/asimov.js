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

    'initialize': function () {

      var self = this;
      _super.initialize.apply(self, arguments);

      self.jobs = [];
      self.pending = [];
      self.limit = 10;
      self.delay = 10;

      self.renderer = new RenderJob(self.options);

      // self.bindTo(self.renderer, 'page:rendering', self.whenPageIsRendering);
    },

    // 'reset': function (models) {

    //   var self = this;

    //   self.start();

    //   _.each(jobs, self.add);

    //   self.trigger('reset', self.jobs);
    // },

    // 'add': function (model) {

    //   var self = this;

    //   if (!model || !model.nodeType) {
    //     throw new Error('Invalid job added to queue');
    //   }

    //   if (!self.addLog || self.addLog.isDone) {
    //     self.addLog = self.logger.wait(self.namespace, 'Adding 0 job(s) to queue');
    //   }

    //   self.jobs.push(model);

    //   self.addLog.nextAndDone();
    // },

    // 'clearAddLog': function () {

    //   var self = this;
    //   self.addLog = null;
    // },

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
      var models = self.models.slice(0, limit);

      self.remove(models);

      return models;
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

      // function whenProcessed (processed, url) {

      //   self.trigger('processed', url, job.nodeType, processed);
      // }

      while (size--) {

        job = models.shift();
        attributes = job.attributes;

        if (!self.loggers[attributes.type] || self.loggers[attributes.type].isDone) {
          self.loggers[attributes.type] = self.logger.wait(self.namespace, 'Processing next 0 ' + attributes.type + ' job(s) in queue');
        }

        job.logger = self.loggers[attributes.type];
        promises.push(self.renderer.run(job));



      // //   if (_.isArray(result)) {
      // //     _.each(result, function (promise) {
      // //       self.pending.push(promise);
      // //       promise.done(whenProcessed);
      // //     });

      // //     self.when.apply(self, self.pending).done(function () {

      // //       if (!self.jobs.length) {
      // //         self.trigger('empty');
      // //       }
      // //     });
      // //   }
      // //   else if (_.isPlainObject(result)) {

      // //     _.each(result, whenProcessed);

      // //     if (!self.jobs.length) {
      // //       self.trigger('empty');
      // //     }
      // //   }
      // //   else {
      // //     throw new Error('Invalid render result');
      // //   }
      }

      self.loopTimeout = _.delay(self.render, delay);
    },

    // 'prio': function (url, response) {

    //   var self = this;
    //   var logger = self.logger.wait(self.namespace, 'Processing priority job in queue @ ' + url);

    //   var job = _.find(self.jobs, function (_job) {
    //     return _job.url === url;
    //   });

    //   self.jobs = _.without(self.jobs, job);

    //   var processed = self.renderer.run(job)[url];
    //   self.trigger('processed', url, job.nodeType, processed);
    // },

    // 'whenPageIsRendering': function (data) {

    //   var self = this;
    //   self.trigger('page:rendering', data);
    // }
  });
});