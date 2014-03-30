var libPath = '../../lib/';
var Watcher = require(libPath + 'watcher/Watcher');
var Collection = require(libPath + 'core/Collection');
var Model = require(libPath + 'core/Model');
var Test = require(libPath + 'runner/Test');

Test.run('watcher/Watcher', function (test) {

  var instance;

  test.beforeEach(function () {

    var templates = new Collection({
      'name': 'simple',
      'path': 'simple'
    });
    var pages = new Collection();

    instance = new Watcher(null, {
      'paths': {
        'styles': ['tests/mocks/styles']
      },
      'templates': templates,
      'pages': pages,
      'muteLog': true
    });
  });

  test.afterEach(function () {
    instance.destroy();
  });

  test.spec('startWatching (string path)', function () {

    test.when('path is NOT a string', function () {

      test.it('should throw an error', function () {

        expect(function () {

          instance.startWatching(null);
        }).to.throw(Error);
      });
    });

    test.when('path is a string', function () {

      test.when('a file in the path is added', function () {

        test.it('should call self.handleChange', function (done) {

          this.timeout(5000);

          var filename = test.getTempFilename();
          var content = '7s89d7a9sd7';

          instance.handleChange = function (path, oldStat, newStat, type) {
            if (path.indexOf(filename) >= 0) {
              expect(type).to.equal('created');
              done();
            }
          };

          instance.startWatching(test.options.tempPath);

          setTimeout(function () {
            test.writeTempFile(filename, content);
          }, 10);
        });
      });

      test.when('a file in the path is removed', function () {

        test.it('should call self.handleChange', function (done) {

          var filename = test.getTempFilename();
          var content = 'foo';

          instance.handleChange = function (path, oldStat, newStat, type) {
            if (path.indexOf(filename) >= 0) {
              expect(type).to.equal('deleted');
              done();
            }
          };

          test.writeTempFile(filename, content);
          instance.startWatching(test.options.tempPath);
          test.removeTempFile(filename);
        });
      });

      test.when('a file in the path is changed', function () {

        test.it('should call self.handleChange', function () {

          var filename = test.getTempFilename();
          var content1 = 'foo';
          var content2 = 'barbaz';

          instance.handleChange = function (path, oldStat, newStat, type) {
            if (path.indexOf(filename) >= 0) {
              expect(type).to.equal('removed');
              done();
            }
          };

          test.writeTempFile(filename, content1);
          instance.startWatching(test.options.tempPath);
          test.writeTempFile(filename, content2);
        });
      });
    });
  });

  test.spec('watch (object model)', function () {

    test.when('model.attributes.type is not defined', function () {

      test.it('should throw an error', function () {

        var model = new Model({
          'path': 'foo',
          'raw': 'bar'
        });

        expect(function () {
          instance.watch(model);
        }).to.throw(Error);
      });
    });

    test.when('model.attributes.path is not defined', function () {

      test.it('should throw an error', function () {

        var model = new Model({
          'type': 'foo',
          'raw': 'bar'
        });

        expect(function () {
          instance.watch(model);
        }).to.throw(Error);
      });
    });

    test.when('model.attributes.raw is not defined', function () {

      test.it('should throw an error', function () {

        var model = new Model({
          'path': 'foo',
          'type': 'bar'
        });

        expect(function () {
          instance.watch(model);
        }).to.throw(Error);
      });
    });
  });

  test.spec('handleChange (string path, object oldStat, object newStat, string type)', function () {

    var extensions = {
      'page': 'txt',
      'template': 'tmpl',
      'styleSheet': 'styl'
    };

    function testHandleChange (type) {

      var actions = ['created', 'modified', 'deleted'];

      for (var i = 0, max = actions.length; i < max; i++) {
        testHandleChangeForAction(type, actions[i]);
      }
    }

    function testHandleChangeForAction (type, action) {

      test.when('a ' + type + ' file is ' + action, function () {
        test.it('should call ' + type + '.' + action + ' handler', function () {

          var spy = sinon.spy(instance._handlers[type], action);
          var path = 'a9ua09dua90sud09sad.' + extensions[type];
          instance.handleChange(path, {}, {}, action);

          expect(spy).to.have.been.calledOnce;
          // expect(spy).to.have.been.calledWith(model, null, instance);

          instance._handlers[type][action].restore();
        });
      });
    }

    testHandleChange('page');
    testHandleChange('template');
    testHandleChange('styleSheet');
  });

  test.spec('parseDependencies (object model)', function () {

    test.when('there is no matching parser for model.attributes.type', function () {

      test.it('should throw an error', function () {

        var model = new Model({
          'path': 'foo',
          'type': 'bar',
          'raw': 'baz'
        });

        expect(function () {
          instance.parseDependencies(model);
        }).to.throw(Error);
      });
    });

    test.when('there is a matching parser for model.attributes.type', function () {

      test.it('should pass model as first argument', function () {

        var model = new Model({
          'path': 'foo',
          'type': 'styleSheet',
          'raw': 'baz'
        });

        var spy = sinon.spy(instance._parsers.styleSheet, 'parse');

        instance.parseDependencies(model);
        expect(spy).to.have.been.calledWith(model);
        instance._parsers.styleSheet.parse.restore();
      });

      test.it('should pass itself as third argument', function () {

        var model = new Model({
          'path': 'foo',
          'type': 'styleSheet',
          'raw': 'baz'
        });

        var spy = sinon.spy(instance._parsers.styleSheet, 'parse');

        instance.parseDependencies(model);
        expect(spy).to.have.been.calledWith(model, null, instance);
        instance._parsers.styleSheet.parse.restore();
      });
    });
  });
});