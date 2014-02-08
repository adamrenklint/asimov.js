describe('HidableViewMixin', function () {

  'use strict';

  var Klass;

  beforeEach(function (done) {
    requirejs([
      'wunderbits/mixins/WBEventsMixin',
      'wunderbits/mixins/HidableViewMixin'
    ], function (
      WBEventsMixin,
      HidableViewMixin
    ) {

      Klass = function () {};
      WBEventsMixin.applyToClass(Klass);
      HidableViewMixin.applyToClass(Klass);

      done();
    });
  });

  describe('show/hide', function () {

    var instance, $el;

    beforeEach(function () {
      instance = new Klass();
      $el = instance.$el = $('<div/>');
    });

    it('should toggle hidden class on `hide`/`show`', function () {
      expect($el.hasClass('hidden')).to.be.false;
      instance.hide();
      expect($el.hasClass('hidden')).to.be.true;
      instance.show();
      expect($el.hasClass('hidden')).to.be.false;
    });

    describe(null, function () {

      beforeEach(function () {
        sinon.spy($el, 'addClass');
        sinon.spy($el, 'removeClass');
      });

      afterEach(function () {
        $el.addClass.restore();
        $el.removeClass.restore();
      });

      it('should call addClass/removeClass', function () {
        instance.hide();
        $el.addClass.should.have.been.calledOnce;
        instance.show();
        $el.removeClass.should.have.been.calledOnce;
      });

      it('should not change class if instance is destroyed', function () {
        instance.destroyed = true;
        instance.hide();
        $el.addClass.should.not.have.been.calledOnce;
        instance.show();
        $el.removeClass.should.not.have.been.calledOnce;
      });
    });

  });

  describe('fadeIn/fadeOut', function () {

    var instance, $el;

    beforeEach(function () {
      instance = new Klass();
      $el = instance.$el = $('<div/>');
    });

    describe('defereds are resolved', function () {
      var spy;

      beforeEach(function () {
        spy = sinon.spy();
      });

      it('fadeIn', function () {
        instance.fadeIn(2000).done(spy);
        _.delay(function () {
          spy.should.have.been.calledOnce;
        }, 2500);
      });

      xit('fadeOut', function () {
        instance.fadeOut(2000).done(spy);
        _.delay(function () {
          spy.should.have.been.calledOnce;
        }, 2500);
      });
    });

    describe('DOM timings', function () {

      it('should take time to fadeIn', function (done) {
        var start = Date.now();
        var deferred = instance.fadeIn(50);
        deferred.done(function () {
          expect(Date.now() - start).to.be.greaterThan(49);
          done();
        });
      });

      // TODO: figure out why fadeOut is broken
      xit('should take time to fadeOut', function (done) {
        var start = Date.now();
        var deferred = instance.fadeOut(50);
        deferred.done(function () {
          expect(Date.now() - start).to.be.greaterThan(49);
          done();
        });
      });
    });

    describe('internal calls', function () {

      beforeEach(function () {
        sinon.spy($el, 'fadeIn');
        sinon.spy($el, 'fadeOut');
      });

      afterEach(function () {
        $el.fadeIn.restore();
        $el.fadeOut.restore();
      });

      it('should take call fadeId/fadeOut on the element', function () {
        instance.fadeIn(50);
        instance.fadeOut(50);
        $el.fadeIn.should.have.been.calledOnce;
        $el.fadeOut.should.have.been.calledOnce;
      });
    });

  });

});