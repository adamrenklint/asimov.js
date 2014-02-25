test('core/Base', [

  '../../lib/core/Base'

], function (runner) {

  var instance;

  runner.beforeEach(function () {
    instance = new runner.deps.Base();
  });

  runner.afterEach(function () {
    instance.destroy();
  });

  runner.spec('trigger (string name, object params)', function () {

    runner.it('should call the event', function () {

      var spy = sinon.spy();
      instance.on('foo', spy);
      var params = { 'foo': 'bar' }
      instance.trigger('foo', params);

      expect(spy).to.have.been.calledOnce;
      expect(spy).to.have.been.calledWith(params);
    });

    runner.it('should also call "all" event', function () {

      var spy = sinon.spy();
      instance.on('all', spy);
      var params = { 'foo': 'bar' }
      instance.trigger('foo', params);

      expect(spy).to.have.been.calledOnce;
    });

    runner.it('should pass the original event name as first argument in "all" event', function () {

      var spy = sinon.spy();
      instance.on('all', spy);
      var params = { 'foo': 'bar' }
      instance.trigger('foo', params);

      expect(spy).to.have.been.calledWith('foo');
    });

    runner.it('should also pass the original arguments', function () {

      var spy = sinon.spy();
      instance.on('all', spy);
      var params = { 'foo': 'bar' }
      instance.trigger('foo', params, 'bro', 'code');

      expect(spy).to.have.been.calledWith('foo', params, 'bro', 'code');
    });
  });
});