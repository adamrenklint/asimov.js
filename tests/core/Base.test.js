var libPath = '../../lib/';
var Base = require(libPath + 'core/Base');
// var TemplatesCollection = require(libPath + 'render/TemplatesCollection');
// var PageNodesCollection = require(libPath + 'nodes/PageNodesCollection');
// var Model = require(libPath + 'core/Model');
// var _ = require('lodash');

var Test = require(libPath + 'runner/Test');

Test.run('parsers/PageParser', function (test) {


  var instance;

  test.beforeEach(function () {
    instance = new Base();
  });

  test.afterEach(function () {
    instance.destroy();
  });

  test.spec('trigger (string name, object params)', function () {

    test.it('should call the event', function () {

      var spy = sinon.spy();
      instance.on('foo', spy);
      var params = { 'foo': 'bar' };
      instance.trigger('foo', params);

      expect(spy).to.have.been.calledOnce;
      expect(spy).to.have.been.calledWith(params);
    });

    test.it('should also call "all" event', function () {

      var spy = sinon.spy();
      instance.on('all', spy);
      var params = { 'foo': 'bar' };
      instance.trigger('foo', params);

      expect(spy).to.have.been.calledOnce;
    });

    test.it('should pass the original event name as first argument in "all" event', function () {

      var spy = sinon.spy();
      instance.on('all', spy);
      var params = { 'foo': 'bar' };
      instance.trigger('foo', params);

      expect(spy).to.have.been.calledWith('foo');
    });

    test.it('should also pass the original arguments', function () {

      var spy = sinon.spy();
      instance.on('all', spy);
      var params = { 'foo': 'bar' };
      instance.trigger('foo', params, 'bro', 'code');

      expect(spy).to.have.been.calledWith('foo', params, 'bro', 'code');
    });
  });

  test.spec('assert (string type, * object, string message', function () {

    // test.when('type is not a string', function () {

    //   test.itShould.throwError();
    // });

    // test.when('type is a string', function () {

    // });

    test.when('type is "defined"', function () {

      test.when('object is an empty string', function () {

        test.itShould.throwError(function () {
          instance.assert('defined', '', 'The thing should be defined');
        });
      });

      test.when('object is non-empty string', function () {

        test.itShould.notThrowError(function () {
          instance.assert('defined', ' ', 'The thing should be defined');
        });
      });
    });

    // test.when('more than one string is passed as type', function () {

    //   test.it('should test each assertion', function () {

    //     test.when('any of the assertions fail', function () {
    //       test.itShould.throwError(function () {
    //         instance.assert('defined string', '', 'The thing should be defined');
    //       });
    //     });

    //     test.when('any all the assertions pass', function () {
    //       test.itShould.notThrowError(function () {
    //         instance.assert('defined string', 's', 'The thing should be defined');
    //       });
    //     });
    //   });
    // });
  });
});