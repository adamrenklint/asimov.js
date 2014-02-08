define([

  './WBRuntime',
  './mixins/WBInstanceUtilitiesMixin',
  './mixins/WBBindableMixin',
  './mixins/WBEventsMixin',
  './mixins/WBDeferrableMixin'

], function (
  WBRuntime,
  WBInstanceUtilitiesMixin,
  WBBindableMixin, WBEventsMixin, WBDeferrableMixin,
  undefined
) {

  'use strict';

  var runtime = WBRuntime;
  var $ = runtime.$;
  var _ = runtime._;
  var Backbone = runtime.Backbone;
  var window = runtime.global;

  var _super = Backbone.Router.prototype;
  var _hasReplaceState = window.history && window.history.replaceState;

  return Backbone.Router.extend({

    'implements': {},

    '_basicRoutes': {
      '': '_triggerDefault',
      '/': '_triggerDefault',
      ':route': '_trigger404',
      ':route/*subroute': '_trigger404'
    },

    'didFireSetRoute': {},

    'constructor': function (options) {

      var self = this;

      options || (options = {});
      self.outlet = options.outlet || self.outlet;

      WBInstanceUtilitiesMixin.applyTo(self);
      WBEventsMixin.applyTo(self);
      WBBindableMixin.applyTo(self);
      WBDeferrableMixin.applyTo(self);

//      w_.bindAll.apply(self, w_.functions(self));

      // Bind the router and the mediator for in-app route
      // changes using the mediators events
      self.bindTo(runtime, 'route', self.setRoute);

      this.isInitialRoute = true;

      _super.constructor.apply(self, arguments);

      self.params = {};

      self.implementControllers();

      return self;
    },

    // stub method to be implemented by subclasses
    // is called on route change, only when a callback exists
    // return false to prevent callback execution
    'before': function () {},

    // stub callback method for 404, to be implemented by subclasses
    'open404': function () {},

    // stub to be implemented by subclass, called when the router believes that a route is triggered by the user clicking the back or forward buttons, or when the browser history is programmatically changed - i.e. all route changes that did not pass through self.navigate
    'onBackOrForward': function () {},

    'triggerRoute': function () {

      var deferred = new $.Deferred();
      return deferred.resolve().promise();
    },

    'parseParams': function (query) {

      var params = {};
      var location = window.location;

      query = query || location.href.split(/\?|#/)[1] || '';

      if (query.length) {

        _.each(query.split('&'), function(fragment) {

          fragment = fragment.split('=');
          params[fragment[0]] = fragment[1] || null;
        });

        if(_hasReplaceState) {
          _.defer(function(){
            window.history.replaceState(null, 'noParams', location.pathname + location.hash);
          });
        }
      }

      return params;
    },

    'parseQueryString': function (string) {

      var vars = string.split('&');
      var params = {};

      for (var i = 0; i < vars.length; i++) {

        var pair = vars[i].split('=');
        if (pair[0].length && pair[1] && pair[1].length) {

          if (i === 0) {

            pair[0] = pair[0].indexOf('?') === 0 ? pair[0].substring(1) : pair[0];
          }

          params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
        }
      }

      return params;
    },

    'start': function () {

      var self = this;

      if (!self.hasStarted) {

        self.params = self.parseParams();

        // start the router, if not started already
        !Backbone.History.started && Backbone.history.start();
        self.hasStarted = true;
        self.trigger('started');
      }
    },

    '_trigger404': function () {

      this.open404();
    },

    '_triggerDefault': function () {

      var self = this;

      if (self.defaultRoute) {
        self.setRoute(self.defaultRoute);
      }
    },

    '_getRoutesHash': function () {

      var self = this;
      return _.extend(self.routes || {}, self._basicRoutes);
    },

    'implementControllers': function () {

      var self = this;
      self.controllers = {};

      for (var name in self.implements) {

        var Constructor = self.implements[name];

        self.controllers[name] = new Constructor({
          'outlet': self.outlet,
          'router': self
        });
      }
    },

    '_bindRoutes': function () {

      var self = this;
      self.routes = self._getRoutesHash();
      _super._bindRoutes.apply(self, arguments);
    },

    'route': function (route, callbackName) {

      var self = this;
      var wrapper = function () {

        var args = arguments;

        // if the route change came from browsers history back or forward,
        // then override any value set for this flag
        if (!self.didFireSetRoute[runtime.currentRoute()]) {

          self.shouldTriggerRoutes = null;
        }

        var beforeResult = self.before.apply(self, [route, callbackName]);

        var callback = typeof callbackName === 'function' ? callbackName : self[callbackName];

        // new rails style controller mapping
        if (callbackName.indexOf('#') > 0) {

          var parts = callbackName.split('#');
          var controller = self.controllers[parts[0]];
          var action = parts[1];
          callback = controller[action];
          controller.params = self.params;
        }

        if (beforeResult !== false && self.shouldTriggerRoutes !== false && typeof callback === 'function') {

          var doOpenRoute = function doOpenRoute () {

            var routing = new $.Deferred();
            self.routing = routing.promise();

            // cache the previous and current route before executing,
            // so that they're available in the callback
            self.previousRoute = self.currentRoute || '';
            self.currentRoute = runtime.currentRoute();

            var action = self.triggerRoute(self.currentRoute);

            action.done(function () {

              var done = callback.apply(self, args) || true;
              self.isInitialRoute = false;

              runtime.trigger('routed', self.currentRoute, self.previousRoute);

              $.when(done || true).then(routing.resolve);
            });
          };

          $.when(self.routing || true).then(doOpenRoute);
        }

        self.shouldTriggerRoutes = null;
      };

      _super.route.call(self, route, callbackName, wrapper);
    },

    'setRoute': function (route, options) {

      var self = this;

      options = options || {};

      options.params && _.each(options.params, function (value, key) {
        key = decodeURIComponent(key);
        value = decodeURIComponent(value);
        self.params[key] = value;
      });

      if (_.isArray(route)) {
        route = route[0];
      }

      // manually keep track of this flag to differentiate between
      // routes triggered by back/forward buttons and setRoute
      self.didFireSetRoute[route] = true;
      _.delay(function () {
        delete self.didFireSetRoute[route];
      }, 500);

      if (options.trigger === undefined) {
        options.trigger = true;
      }

      self.shouldTriggerRoutes = options.trigger;

      if (options.replace && _hasReplaceState) {

        window.history.replaceState(null, '', '#/' + route || '');
      }
      else if (!options.replaceOnly) {

        self.navigate('#/' + (route || ''), options);
      }
    }
  });
});