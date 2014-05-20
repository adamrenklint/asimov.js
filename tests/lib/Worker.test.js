var test = require('asimov-test');
var Asimov = require('../../lib/Worker');

test('lib/Worker', function (test) {

  var asimov, instance;

  beforeEach(function () {
    instance = new Asimov({
      'muteLog': true
    });
    asimov = instance.publicInterface();
  });

  afterEach(function () {
    instance.destroy();
  });

  test.spec('start ()', function () {

    test.when('there are no registered initializers', function () {

      test.it('should trigger "app:started"', function () {

        var spy = sinon.spy();
        asimov.once('app:started', spy);
        asimov.start();

        expect(spy).to.have.been.calledOnce;
      });
    });

    test.when('there are registered initializers', function () {

      test.it('should start initializer sequence', function () {

        var spy = sinon.spy();
        asimov.init(function (next) {
          spy();
          next();
        });
        asimov.start();

        expect(spy).to.have.been.calledOnce;
      });

      test.it('should trigger "app:started"', function () {

        var spy = sinon.spy();
        asimov.init(function (next) {
          next();
        });

        asimov.once('app:started', spy);
        asimov.start();

        expect(spy).to.have.been.calledOnce;
      });
    });
  });
});
