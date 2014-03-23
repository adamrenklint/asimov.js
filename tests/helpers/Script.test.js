test([

  '../../lib/helpers/Script',
  '../../lib/core/Collection',
  '../../lib/nodes/ScriptNodesCollection'

], function (test) {

  var instance;

  beforeEach(function () {

    instance = new test.deps.Script({
      'name': 'script',
      'queue': new test.deps.Collection(),
      'scripts': new test.deps.ScriptNodesCollection(),
      'paths': {
        'scripts': 'site/scripts'
      }
    });

    instance.currentUrl = '/blog';
  });

  test.spec('run (string name)', function () {

    test.when('name is not a string', function () {

      test.itShould.throwError(function () {
        instance.run(null);
      });
    });

    test.when('name is a string', function () {

      test.it('should return a script tag', function () {

        var result = instance.run('site/scripts/bootstrap', {
          'hash': {}
        });
        expect(result).to.include('<script');
        expect(result).to.include('src="/site/scripts/bootstrap.js');
      });
    });
  });
});