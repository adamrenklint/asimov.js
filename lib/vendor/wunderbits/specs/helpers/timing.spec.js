describe('Timing Helper', function () {

  'use strict';

  var Topic;
  var ourConsole;

  beforeEach(function (done) {

    requirejs([

      'wunderbits/helpers/timing',
      'wunderbits/helpers/console'

    ], function (Timing, Console) {

      Topic = Timing;
      ourConsole = Console;

      sinon.spy(ourConsole, 'time');
      sinon.spy(ourConsole, 'timeEnd');

      Topic.enableTiming();
      done();
    });
  });

  afterEach(function () {

    ourConsole.time.restore();
    ourConsole.timeEnd.restore();

    Topic.disableTiming();
  });

  describe('#start', function () {

    //disabled, cannot spy on native code console.time
    it('should map to console.time', function () {

      Topic.start('spec');
      Topic.end('spec');

      ourConsole.time.should.have.been.calledOnce;
      ourConsole.time.calledWith('spec').should.be.true;
    });
  });

  describe('#end', function () {

    // disabled, cannot spy on native code console.timeEnd
    it('should map to console.timeEnd', function () {

      Topic.start('spec');
      Topic.end('spec');

      ourConsole.timeEnd.should.have.been.calledOnce;
      ourConsole.timeEnd.calledWith('spec').should.be.true;
    });
  });
});