var libPath = '../../lib/';
var Script = require(libPath + 'helpers/Script');
var Collection = require(libPath + 'core/Collection');
var ScriptNodesCollection = require(libPath + 'nodes/ScriptNodesCollection');
var Test = require(libPath + 'runner/Test');

Test.run('helpers/Script', function (test) {

  var instance;

  beforeEach(function () {

    instance = new Script({
      'name': 'script',
      'queue': new Collection(),
      'scripts': new ScriptNodesCollection(),
      'paths': {
        'scripts': 'lib'
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

        var result = instance.run('scripts/bootstrap', {
          'hash': {}
        });
        expect(result).to.include('<script');
        expect(result).to.include('src="/lib/scripts/bootstrap.js');
      });
    });
  });
});