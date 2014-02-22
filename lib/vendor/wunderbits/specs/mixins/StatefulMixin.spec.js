describe('StatefulMixin', function () {

  'use strict';

  var Klass, Topic;

  beforeEach(function (done) {
    requirejs([
      'wunderbits/mixins/WBEventsMixin',
      'wunderbits/mixins/StatefulMixin'
    ], function (
      WBEventsMixin,
      StatefulMixin
    ) {

      Topic = StatefulMixin;
      Klass = function () {};
      WBEventsMixin.applyToClass(Klass);

      done();
    });
  });

  describe('#set', function () {

    var spy, instance;

    beforeEach(function () {
      spy = sinon.spy();
      instance = new Klass();
      Topic.applyTo(instance);
    });

    it('should store the value on attributes map', function () {
      instance.set('prop', 'val');
      expect(instance.attributes).to.not.be.undefined;
      expect(instance.attributes.prop).to.be.equal('val');
    });

    it('should accept both style of arguments', function () {
      instance.set('prop1', 'val1');
      instance.set({'prop2': 'val2'});
      expect(instance.attributes.prop1).to.be.equal('val1');
      expect(instance.attributes.prop2).to.be.equal('val2');
    });

    it('should trigger change events for new properties', function () {
      instance.on('change:prop', spy);
      instance.set('prop', 'val');
      spy.should.have.been.calledOnce;
    });

    it('should not trigger events for a silent set', function () {
      instance.on('change:prop', spy);
      instance.set('prop', 'val', { 'silent': true });
      spy.should.have.not.been.called;
    });

    it('should unset values', function () {
      instance.set('prop', 'val1');
      expect(instance.attributes.prop).to.be.equal('val1');
      instance.set('prop', 'val2', { 'unset': true });
      expect(instance.attributes.prop).to.not.be.equal('val2');
      expect(instance.attributes.prop).to.be.undefined;
    });
  });

});