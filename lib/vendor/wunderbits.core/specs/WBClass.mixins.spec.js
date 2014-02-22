describe('WBClass/mixins', function () {

  'use strict';

  var ExtendedClass, Mixin, applySpy, MixinInit;

  beforeEach(function (done) {
    requirejs([
      'WBClass',
      'WBMixin'
    ], function (WBClass, WBMixin) {

      MixinInit = sinon.spy();

      Mixin = WBMixin.extend({
        'initialize': MixinInit
      });

      applySpy = sinon.spy(Mixin, 'applyToClass');

      ExtendedClass = WBClass.extend({
        'foo': 'bar',
        'mixins': [Mixin]
      });

      done();
    });
  });

  afterEach(function () {
    applySpy && applySpy.restore();
  });

  it('should strip out mixins from protoProps', function () {
    expect(ExtendedClass.prototype.mixins).to.be.undefined;
  });

  it('should apply mixins from protoProps to the prototype', function () {
    expect(applySpy).to.have.been.calledOnce;
  });

  it('should call mixin initializers on class initialize', function () {
    expect(MixinInit).to.have.not.been.called;
    new ExtendedClass();
    expect(MixinInit).to.have.been.called;
  });
});