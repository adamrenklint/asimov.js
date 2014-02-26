test('core/Model', [

  '../../lib/core/Model'

], function (runner) {

  var instance;

  runner.beforeEach(function () {
    instance = new runner.deps.Model();
  });

  runner.spec('initialize (object attributes, object options)', function () {

    runner.when('attributes is an object', function () {

      runner.it('should set it as self.attributes', function () {

        var attributes = {
          'foo': 'bar'
        };

        instance = new runner.deps.Model(attributes);

        expect(instance.attributes.foo).to.equal('bar');
      });
    });
  });
});