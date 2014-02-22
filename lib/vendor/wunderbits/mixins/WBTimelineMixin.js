//
//  Logs timline events into storage
//  Log into the timline model of the storage DB store
//  From the model you can load by namespace
//  As an example, fetching the timeline model from the DB will allow you to fetch
//  the namespace 'test':
//  'test': {
//    'start': 1029382938,
//    'end': 9293819283,
//    'duration': 234234
//  }


// user_login: from app start to interface loaded and tasks rendered

// login_start: from app start to login view visible
// login_load_app: from click "login", to sending out the first batch
// login_latency: from click "login", to receive login endpoint result

// login_load_content: from first batch request out, to all tasks fetched,
//   no more before timestamp (runtime.beforeDone)

// login_full_display: from all tasks fetched, to interface and tasks rendered

// login_initial_display: from app start to first batch (whatever you wanted to see,
//   like the inbox, homie) rendered

// user_refresh: from app start to interface loaded and tasks rendered

// refresh_start: from app start to any interface visible
// refresh_db_load: from start db load, to db loaded (including sorting)

// refresh_update: first normal batch request after refresh, empty or not

define([

  '../WBMixin',
  '../lib/dependencies',
  '../lib/createUID',

], function (WBMixin, dependencies, createUID) {

  'use strict';

  var Backbone = dependencies.Backbone;
  var w_ = dependencies.w_;
  var $ = dependencies.$;

  return WBMixin.extend({

    // initialize is used by WBMixin, it does not override the class it is being applied to
    'initialize': function () {

      var self = this;

      self.timelineEnabled = false;

      self.timelineModelHasFetched = new $.Deferred();

      self.timelineModel = new Backbone.Model({
        'id': 'timeline'
      });

      self.timelineModel.storeName = 'storage';

      self.on('timeline:start', self.logStart);
      self.on('timeline:end', self.logEnd);

      // api benchmarks
      self.on('timeline:api', self.logAPI);

      // specific events
      self.once('sync:started', function () {

        self.logTimepoint('login_load_app', 'end');
      });

      self.once('lists:ready', function () {

        self.logTimepoint('lists_loaded', 'end');
      });

      self.once('before:done', function () {

        // not a range event
        self.logTimepoint('all_api_data_loaded', 'start');
      });

      self.once('sync:end', function () {

        self.logTimepoint('initial_sync_processed', 'start');
      });

      self.once('taskCounts:rendered', function () {

        self.logTimepoint('task_counts_rendered', 'start');
      });
    },

    'logStart': function (namespace) {
      var self = this;
      self.logTimepoint(namespace, 'start');
    },

    'logEnd': function (namespace) {
      var self = this;
      self.logTimepoint(namespace, 'end');
    },

    'logTimepoint': function (namespace, point) {

      var self = this;

      if (!self.isTimelineEnabled()) {return;}

      var now = self.now();

      self.fetchTimelineData().done(function () {

        var oldData = self.timelineModel.get(namespace) || {};

        var newData = {};
        newData[point] = now;

        if (point === 'end' && oldData.start) {
          newData.duration = now - oldData.start;
        }
        else if (point === 'end') {
          return;
        }

        var data = {};
        data[namespace] = w_.merge({}, oldData, newData);

        self.timelineModel.save(data);
      });
    },

    'duration': function (namespace, duration) {

      var self = this;

      if (!self.isTimelineEnabled()) {return;}

      self.fetchTimelineData().done(function () {

        var oldData = self.timelineModel.get(namespace) || {};

        var newData = {
          'duration': duration
        };

        var data = {};
        data[namespace] = w_.merge({}, oldData, newData);

        self.timelineModel.save(data);
      });
    },

    'logAPI': function (apiData) {

      var self = this;
      var data = {};

      if (!self.isTimelineEnabled()) {return;}

      data['apiBenchmark' + createUID()] = apiData;

      self.fetchTimelineData().done(function () {

        self.timelineModel.save(data);
      });
    },

    'now': function () {

      return Date.now();
    },

    'fetchTimelineData': function () {

      var self = this;

      if (self.timelineModelHasFetched.state() === 'pending' && !self.timelineFetchedOnce) {
        self.timelineFetchedOnce = true;
        self.timelineModel.fetch({
          'success': self.timelineModelHasFetched.resolve,
          'error': self.timelineModelHasFetched.resolve
        });
      }

      return self.timelineModelHasFetched.promise();
    },

    'resetTimeline': function () {

      this.timelineModel.clear().save({
        'id': 'timeline'
      });
    },

    'isTimelineEnabled': function () {
      return !!this.timelineEnabled;
    },

    'enableTimeline': function () {
      this.timelineEnabled = true;
    },

    'disableTimeline': function () {
      this.timelineEnabled = false;
    }
  });
});