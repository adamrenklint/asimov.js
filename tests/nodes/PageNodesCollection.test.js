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
        'content': 'content',
        'frameworkPages': 'not-a-real-url'
      }
    });
  });

  test.spec('add (array models, object options)', function () {

    test.when('several unique models with similar ids are passed', function () {

      test.beforeEach(function () {
        instance.add([{
          'type': 'page',
          'path': process.cwd() + '/content/'
        }, {
          'type': 'page',
          'path': process.cwd() + '/content/sub'
        }, {
          'type': 'page',
          'path': process.cwd() + '/content/sub/sub2'
        }, {
          'type': 'page',
          'path': process.cwd() + '/content/foo'
        }, {
          'type': 'page',
          'path': process.cwd() + '/content/foo/bar'
        }]);
      });

      test.it('should add each unique model', function () {
        expect(instance.models.length).to.equal(5);
      });
    });
  });
});