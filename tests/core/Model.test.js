var libPath = '../../lib/';
var Model = require(libPath + 'core/Model');
var Test = require(libPath + 'runner/Test');

Test.run('core/Model', function (test) {

  var instance;

  test.beforeEach(function () {
    instance = new Model();
  });

  test.spec('initialize (object attributes, object options)', function () {

    test.when('attributes is an object', function () {

      test.it('should set it as self.attributes', function () {

        var attributes = {
          'foo': 'bar'
        };

        instance = new Model(attributes);

        expect(instance.attributes.foo).to.equal('bar');
      });
    });
  });
});