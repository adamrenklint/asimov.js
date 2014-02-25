test('core/Collection', [

  '../../lib/core/Collection'

], function (runner) {

  var instance;

  runner.beforeEach(function () {
    instance = new runner.deps.Collection();
  });

  runner.spec('add (object model, object options)', function () {

    runner.when('a model is passed as argument', function () {

      runner.it('should add model to self.models', function () {

        var model = {
          'foo': 'bar',
          'id': 44
        };

        instance.add(model);

        expect(instance.models.length).to.equal(1);
        expect(instance.models[0].id).to.equal(44);
      });

      runner.it('should trigger "add" event, passing the model as argument');
    });
  });
});