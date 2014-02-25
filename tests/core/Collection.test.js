test('core/Collection', [

  '../../lib/core/Collection',
  'lodash'

], function (runner) {

  var instance, _;

  runner.beforeEach(function () {
    instance = new runner.deps.Collection();
    _ = runner.deps.lodash;
  });

  runner.afterEach(function () {
    instance.destroy();
  });

  runner.spec('add (object model, object options)', function () {

    runner.when('a model is passed as argument', function () {

      runner.it('should add model to self.models', function () {

        var attributes = {
          'foo': 'bar'
        };

        instance.add(attributes);

        expect(instance.models.length).to.equal(1);
        expect(instance.models[0].attributes.foo).to.equal('bar');
      });

      runner.it('should trigger the models "add" event', function () {

        var attributes = {
          'foo': 'bar'
        };
        var spy = sinon.spy();
        var model = new instance.model(attributes);
        model.on('add', spy);
        instance.add(model);

        expect(spy).to.have.been.calledOnce;
        model.destroy();
      });

      runner.it('should trigger the models "all" event', function () {

        var attributes = {
          'foo': 'bar'
        };
        var spy = sinon.spy();
        var model = new instance.model(attributes);
        model.on('all', spy);
        instance.add(model);

        expect(spy).to.have.been.calledOnce;
        model.destroy();
      });

      runner.it('should listen for models "all" event and call self._onModelEvent()', function () {

        var attributes = {
          'foo': 'bar'
        };
        var spy = sinon.spy(instance, '_onModelEvent');
        instance.add(attributes);

        expect(spy).to.have.been.calledOnce;
      });

      runner.it('should trigger "add" event', function () {

        var spy = sinon.spy();
        var attributes = {
          'foo': 'bar'
        };

        instance.on('add', spy);
        instance.add(attributes);

        expect(spy).to.have.been.calledOnce;
        expect(spy.args[0][0].attributes.foo).to.equal('bar');
      });
    });
  });
});