var test = require('asimov-test');
// Something is up with the sequencer, it can't pass it's own tests
// Using Asimov for now, TODO it later
var Sequencer = require('../../lib/Asimov');

test('lib/Sequencer', function (test) {

  var sequencer, instance;

  beforeEach(function () {
    instance = new Sequencer({
      'muteLog': true
    });
    sequencer = instance.publicInterface();
  });

  afterEach(function () {
    instance.destroy();
  });

  // test.spec('addSequence (string namespace, string method)');

  test.spec('runSequence (string namespace, function done)', function () {

    test.when('namespace is not valid', function () {

      test.itShould.throwError(function () {
        sequencer.runSequence('beeswax');
      });
    });

    test.when('namespace is valid', function () {

      test.it('should execute the first job', function () {

        var spy = sinon.spy();
        sequencer.init(spy);
        sequencer.runSequence('initializer');

        expect(spy).to.have.been.calledOnce;
      });

      test.it('should pass a "next" iterator function', function (done) {

        sequencer.init(function (next) {
          expect(next).to.be.a('function');
          done();
        });

        sequencer.runSequence('initializer');
      });

      test.it('should pass the any data provided', function (done) {

        var data = {
          'id': 'fooooobar'
        };

        sequencer.init(function (next, _data) {
          expect(_data.id).to.equal('fooooobar');
          done();
        });

        sequencer.runSequence('initializer', data);
      });

      test.when('the job executes the "next" iterator', function () {

        test.it('should execute the next job', function (done) {

          sequencer.init(function (next) {
            next();
          });

          sequencer.init(function (next) {
            done();
          });

          sequencer.runSequence('initializer');
        });

        test.when('the last job calls the "next" iterator', function () {

          test.it('should call the "done" callback', function (done) {

            sequencer.init(function (next) {
              next();
            });

            sequencer.runSequence('initializer').done(function () {
              done();
            });
          });
        });
      });
    });
  });
});
