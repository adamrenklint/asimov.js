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

    runner.when('model is a valid model', function () {

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

    runner.when('several unique models are added', function () {

      runner.it('should store all of them in self.models', function () {

        var attributes1 = { 'foo': 'bar' };
        var attributes2 = { 'foz': 'nil' };
        var attributes3 = { 'zoo': 'lan' };

        instance.add(attributes1);
        instance.add(attributes2);
        instance.add(attributes3);

        expect(instance.models.length).to.equal(3);
        expect(instance.models[0].attributes.foo).to.equal('bar');
        expect(instance.models[2].attributes.zoo).to.equal('lan');
      });

      runner.when('the models use slashes in their ids', function () {

        runner.it('should treat each as unique', function () {

          var attributes1 = { 'id': '/', 'foo': 'bar' };
          var attributes2 = { 'id': '/foo', 'foz': 'nil' };
          var attributes3 = { 'id': '/foo/bar', 'zoo': 'lan' };

          instance.add(attributes1);
          instance.add(attributes2);
          instance.add(attributes3);

          expect(instance.models.length).to.equal(3);
          expect(instance.models[0].attributes.foo).to.equal('bar');
          expect(instance.models[2].attributes.zoo).to.equal('lan');
        });

        runner.it('should find them by id', function () {

          var attributes1 = { 'id': '/', 'foo': 'bar' };
          var attributes2 = { 'id': '/foo', 'foz': 'nil' };
          var attributes3 = { 'id': '/foo/bar', 'zoo': 'lan' };

          instance.add(attributes1);
          instance.add(attributes2);
          instance.add(attributes3);

          // Why double the length? Collections store two references,
          // one for the id (idAttribute) and one for the cid
          expect(_.keys(instance._byId).length).to.equal(6);
          expect(instance.get('/').attributes.foo).to.equal('bar');
          expect(instance.get('/foo/bar').attributes.zoo).to.equal('lan');
        });
      });
    });
  });
});