define([

  'application/runtime',
  './lib/dependencies',

  './WBView'

], function (runtime, dependencies, WBView, undefined) {

  'use strict';

  var _super = WBView.prototype;
  var _ = dependencies._;
  var w_ = dependencies.w_;
  var $ = dependencies.$;

  return WBView.extend({

    'emits': {},

    'observes': {
      'model': {},
      'collection': {},
      'runtime': {}
    },

    // event proxies allow for triggering binding to more than one master
    // event at once, by binding to the proxy event instead.
    'eventProxies': {

      'tap': ['click', 'touchstart'],
      'move': ['mousemove', 'touchmove']
    },

    'initialize': function () {

      var self = this;

      self.implements = self._concatFromSuper(self, 'implements');
      self.emits = self._mergeFromSuper(self, 'emits');

      _super.initialize.apply(self, arguments);

      self.options = self._mergeFromSuper(self, 'options');

      self.createObserveBindings();

      self.controllers = [];
      self.createControllerInstances();
    },

    'triggered': function () {

      var self = this;
      var args = _.toArray(arguments);
      var parentPrefix = '*children';
      var childrenPrefix = '*parents';

      if (self._superView && args[0].indexOf(childrenPrefix) < 0) {

        var parentsPayload = _.clone(args);

        if (parentsPayload[0].indexOf(parentPrefix) < 0) {
          parentsPayload[0] = parentPrefix + ':' + parentsPayload[0];
        }

        self._superView.trigger.apply(self._superView, parentsPayload);
      }

      if (self._subviews && args[0].indexOf(parentPrefix) < 0) {

        var childrenPayload = _.clone(args);

        if (childrenPayload[0].indexOf(childrenPrefix) < 0) {
          childrenPayload[0] = childrenPrefix + ':' + childrenPayload[0];
        }

        var subview;
        for (var i = 0, max = self._subviews.length; i < max; i++) {
          subview = self._subviews[i];
          subview.trigger.apply(subview, childrenPayload);
        }
      }
    },

    // Convenience method for rendering an instance of a view class as
    // a named subview and appending it to self.el
    'renderSubview': function (Constructor, options, name) {

      var self = this;
      options || (options = {});
      name || (name = Constructor.toString());

      options.state = options.state || self.state;

      var view = self.addSubview(new Constructor(options), name);
      self.el.appendChild(view.render().el);

      return view;
    },

    'createObserveBindings': function (instance) {

      var self = this;
      instance = instance || self;
      var observes = instance.observes;
      var observee, methodList, events;

      for (var type in observes) {

        if (type === 'events' || type === '*parents' || type === '*children') {
          observee = self;
        }
        else if (type === 'runtime') {
          observee = runtime;
        }
        else {
          observee = self[type];
        }

        events = observes[type];

        if (observee && _.isFunction(observee.on) && _.size(events)) {

          for (var key in events) {

            methodList = events[key];

            if (!_.isArray(methodList)) {

              self._bindObserveeEvent(methodList, observee, key, type);
            }
            else {

              for (var i2 = 0, max2 = methodList.length; i2 < max2; i2++) {

                self._bindObserveeEvent(methodList[i2], observee, key, type);
              }
            }

            methodList = null;
          }
        }

        observee = null;
      }

      instance.constructor.__super__ && self.createObserveBindings.call(self, instance.constructor.__super__);
    },

    '_bindObserveeEvent': function (methodName, observee, key, type) {

      var self = this;
      var method;

      if (type[0] === '*') {
        key = type + ':' + key;
      }

      if (_.isFunction(methodName)) {
        method = methodName;
      }
      else if (methodName[0] === '>') {
        method = function () {
          var args = [methodName.substr(1)].concat(_.toArray(arguments));
          self.trigger.apply(self, args);
        };
      }
      else {
        method = self[methodName];
      }

      _.isFunction(method) && self.bindTo(observee, key, method);
    },

    'createControllerInstances': function () {

      var self = this;

      // Make a list of controller constructors
      var Controllers = _.isFunction(self.implements) ? self.implements() : self.implements;
      Controllers = _.unique(Controllers);

      self.implemented = [];

      var Controller, controller;
      Controllers.reverse();

      for (var i = 0, max = Controllers.length; i < max; i++) {
        Controller = Controllers[i];

        // If we have already implemented a controller that inherits from
        // this controller, we don't need another one...
        if (self.implemented.indexOf(Controller.toString()) < 0) {

          controller = new Controller(self);
          self.controllers.push(controller);

          self.trackImplementedSuperConstructors(Controller);
        }
      }

      return self.implemented;
    },

    'trackImplementedSuperConstructors': function (Controller) {

      var self = this;
      var superConstructor = Controller.__super__ && Controller.__super__.constructor;

      if (superConstructor) {
        self.implemented.push(superConstructor.toString());
        self.trackImplementedSuperConstructors(superConstructor);
      }
    },

    // Get an events hash, based on self.emits
    'getEvents': function (events) {

      var self = this;
      var emits = _.isFunction(self.emits) ? self.emits() : self.emits;
      return w_.merge({}, emits, events);
    },

    'delegateEvents': function (events) {

      var self = this;

      events = self.getEvents(events);
      events = self.mapEventProxies(events);

      _.each(events, function (event, selector) {
        events[selector] = function () {
          var args = [event].concat(_.toArray(arguments));
          self.trigger.apply(self, args);
        };
      });

      // merge these events with the ones for regular backbone view
      // TODO: we should not need to do this once we stop using the events hash.
      events = w_.merge({}, events, _.result(self, 'events'));

      // delegate events via backbone
      _super.delegateEvents.call(self, events);
    },

    'mapEventProxies': function (events) {

      var self = this;

      _.each(events, function (event, selector) {

        var masters = self.eventProxies[selector];

        if (masters && masters.length) {

          // Add the master events
          _.each(masters, function (master) {
            events[master] = event;
          });

          // Remove the proxy event
          delete events[selector];
        }
      });

      return events;
    },

    'onDestroy': function () {

      var self = this;

      _super.onDestroy && _super.onDestroy.apply(self, arguments);

      // Loop and destroy
      _.each(self.controllers, function (controller) {

        // A controller can exist multiple times in the list, since it's based on the event name, so make sure to only destroy each one once
        controller.destroyed || controller.destroy();
      });

      delete self.controllers;
    },

    // Overloaded destroy method, allows views to handle visual destruction in
    // #renderDestroy before actually destroying the instance
    'destroy': function () {

      var self = this;
      var deferred = new $.Deferred();
      self.renderDestroy(deferred).always(function () {

        !self.destroyed && _super.destroy.call(self);
      });
    },

    // Can be implemented by subclasses to animate or clean up view visually
    // before actually destroying it. Resolve the deferred when the view can
    // be destroyed.
    'renderDestroy': function (deferred) {

      return deferred.resolve().promise();
    }
  });
});
