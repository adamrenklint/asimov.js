test([

  '../../lib/nodes/PageNodesCollection'

], function (test) {

  var instance;

  beforeEach(function () {

    instance = new test.deps.PageNodesCollection(null, {
      'localization': {
        'defaultLangCode': 'en'
      },
      'paths': {
        'content': 'tests/mocks/pages',
        'frameworkPages': 'tests/mocks/pages'
      }
    });
  });

  test.spec('add (array models, object options)', function () {

    test.when('several unique models with similar ids are passed', function () {

      test.beforeEach(function () {
        instance.add([{
          'type': 'page',
          'path': process.cwd() + '/' + instance.options.paths.content + '/page.txt'
        }, {
          'type': 'page',
          'path': process.cwd() + '/' + instance.options.paths.content + '/sub/page.txt'
        }, {
          'type': 'page',
          'path': process.cwd() + '/' + instance.options.paths.content + '/sub/sub2/page.txt'
        }, {
          'type': 'page',
          'path': process.cwd() + '/' + instance.options.paths.content + '/foo/page.txt'
        }, {
          'type': 'page',
          'path': process.cwd() + '/' + instance.options.paths.content + '/foo/bar/page.txt'
        }]);
      });

      test.it('should add each unique model', function () {
        expect(instance.models.length).to.equal(5);
      });
    });
  });
});