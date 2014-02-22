describe('WBDestroyableMixin', function () {

  'use strict';

  var Klass;

  beforeEach(function (done) {
    requirejs([
      'wunderbits/mixins/WBEventsMixin',
      'wunderbits/mixins/WBDestroyableMixin'
    ], function (
      WBEventsMixin,
      WBDestroyableMixin
    ) {

      Klass = function () {};
      WBEventsMixin.applyToClass(Klass);
      WBDestroyableMixin.applyToClass(Klass);

      done();
    });
  });

  describe('#destroy', function () {

    var spy, instance;

    beforeEach(function () {
      spy = sinon.spy();
      instance = new Klass();
    });

    it('should trigger destroy', function () {
      instance.on('destroy', spy);
      instance.destroy();
      spy.should.have.been.calledOnce;
    });

    it('should call `unbind`', function () {
      instance.unbind = spy;
      instance.destroy();
      spy.should.have.been.calledOnce;
    });

    it('should call `unbindAll`', function () {
      instance.unbindAll = spy;
      instance.destroy();
      spy.should.have.been.calledOnce;
    });

    it('should call `onDestroy`', function () {
      instance.onDestroy = spy;
      instance.destroy();
      spy.should.have.been.calledOnce;
    });

    it('should cleanup own properies', function () {
      instance.x = 5;
      instance.y = 6;
      instance.z = function () {};
      instance.destroy();
      expect(instance.x).to.be.undefined;
      expect(instance.y).to.be.undefined;
      expect(instance.z).to.not.be.undefined;
    });

    it('should noop own methods', function () {
      instance.z = function () {};
      instance.destroy();

      expect(instance.z).to.be.a('function');
      expect(instance.z.name).to.equal('noop');
      expect(instance.z.length).to.equal(0);

      // can't test this in node,
      // because in node all the JS is instrumented
      if (!isNode) {
        var zSource = instance.z.toString().replace(/\s+/g, '');
        expect(zSource).to.equal('functionnoop(){}');
      }
    });

    it('should mark instance as destroyed', function () {
      expect(instance.destroyed).to.be.undefined;
      instance.destroy();
      expect(instance.destroyed).to.be.true;
    });
  });

});