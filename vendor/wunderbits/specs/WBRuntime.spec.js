describe('WBRuntime', function () {

  'use strict';

  var topic, Topic, ParentClass, WBEnvironmentModel;
  var realDependencies = {};

  beforeEach(function (done) {
    requirejs([
      'wunderbits/WBRuntime',
      'wunderbits/WBSingleton',
      'wunderbits/WBEnvironmentModel',
      'wunderbits/lib/dependencies'
    ], function (WBRuntime, WBSingleton, _WBEnvironmentModel, dependencies) {

      Topic = WBRuntime;
      ParentClass = WBSingleton;
      WBEnvironmentModel = _WBEnvironmentModel;

      // save the real dependencies for comparison
      realDependencies.lodash = dependencies._;
      realDependencies.jquery = dependencies.$;
      realDependencies.backbone = dependencies.Backbone;

      done();
    });
  });

  beforeEach(function () {
    topic = Topic;
  });

  describe('exposed objects', function () {

    var dependencies = {
      '_': 'lodash',
      '$': 'jquery',
      'Backbone': 'backbone'
    };

    var testDependency = function (key) {
      it('should expose ' + dependencies[key] + ' as "runtime.'+ key + '"', function () {

        topic[key].should.not.be.undefined;
        topic[key].should.deep.equal(realDependencies[dependencies[key]]);
      });
    };

    for (var key in dependencies) {
      testDependency(key);
    }

    it('should expose an instance of WBEnvironmentModel as runtime.env', function () {

      topic.env.should.deep.equal(WBEnvironmentModel);
    });
  });

  describe('#currentRoute', function () {

    it('should return the current route, without prefixed #/', function () {

      var prevLocation = topic.global.location.href || '';
      var fakeRoute = '/whatever/you/want';
      var goToRoute = fakeRoute;

      if (!~prevLocation.indexOf('#')) {
        goToRoute = '#' + goToRoute;
      }

      topic.global.location.href = prevLocation + goToRoute;

      var route = topic.currentRoute();
      var realRoute = (topic.global.location.href || '').split('#/')[1] || '';

      route.should.equal(realRoute);

      topic.global.location.href = (topic.global.location.href || '').replace(fakeRoute, '');
    });
  });

  describe('#currentDomain', function () {

    it('should return the current domain', function () {

      var realDomain = topic.global.location.hostname || '';
      var testDomain = topic.currentDomain();

      testDomain.should.equal(realDomain);
    });
  });
});