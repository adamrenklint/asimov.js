var test = require('asimov-test');
var Configurable = require('../../../lib/mixins/Configurable');
var Base = require('../../../lib/Base');

test('lib/mixins/Configurable', function (test) {

  var instance;

  var Config = Base.extend({
    'mixins': [
      Configurable
    ]
  });

  beforeEach(function () {
    instance = new Config({
      'muteLog': true
    });
  });

  afterEach(function () {
    instance.destroy();
  });

  test.spec('config ()', function () {

    test.it('should return the configuration', function () {

      var config = instance.config();
      expect(config).to.be.a('object');
    });

    test.it('should return a read-only copy', function () {

      var config1 = instance.config();
      config1.foo = 'bar';
      var config2 = instance.config();
      config2.foo = 'barzzz';
      expect(config1.foo).to.equal('bar');
    });
  });

  test.spec('config (string attribute)', function () {

    test.when('the attribute has not been set', function () {

      test.it('should return undefined', function () {

        expect(instance.config('undefinedVar')).to.be.undefined;
      });
    });

    test.when('the attribute has been set', function () {

      test.it('should return the value', function () {

        instance.config('someVar', 'foo');
        expect(instance.config('someVar')).to.equal('foo');
      });
    });
  });

  test.spec('config (string attribute, * value)', function () {

    test.it('should set the value', function () {

      instance.config('anyVar', 'foobar');
      expect(instance.config('anyVar')).to.equal('foobar');
    });

    test.it('should return the value', function () {

      expect(instance.config('anyVar2', 'foobar')).to.equal('foobar');
    });

    test.when('attribute is a constant name, all uppercase', function () {

      test.when('the constant has not been set before', function () {

        test.it('should set the value', function () {

          instance.config('MY_CONSTANT', 'foobar');
          expect(instance.config('MY_CONSTANT')).to.equal('foobar');
        });
      });

      test.when('the constant has been set before', function () {

        test.itShould.throwError(function () {

          instance.config('MY_CONSTANT2', 'foobar');
          instance.config('MY_CONSTANT2', 'foobar');
        });
      });
    });
  });

  test.spec('config (object config)', function () {

    test.it('should set each attribute value', function  () {

      instance.config({
        'foo': 'bar',
        'zoo': 'keeper'
      });

      expect(instance.config().foo).to.equal('bar');
      expect(instance.config().zoo).to.equal('keeper');
    });
  });
});
