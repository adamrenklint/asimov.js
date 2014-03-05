test([

  '../../lib/nodes/PageNode',
  'lodash'

], function (test) {

  var instance, _;

  beforeEach(function () {

    _ = test.deps.lodash;
    instance = new test.deps.PageNode({
      'path': 'fake/soemthing.txt'
    }, {
      'localization': {
        'defaultLangCode': 'en'
      },
      'paths': {
        'content': 'tests/mocks/pages',
        'frameworkPages': 'tests/mocks/pages'
      }
    });
  });

  test.spec('getUrl (string url)', function () {

    test.it('should parse urls correctly', function () {

      function getPath (tail) {
        return process.cwd() + '/tests/mocks/pages' + tail + '/page.txt';
      }

      tests = {};
      tests[getPath('')] = '/';
      tests[getPath('/foo')] = '/foo';
      tests[getPath('/foo/bar')] = '/foo/bar';
      tests[getPath('/sub/sub2')] = '/sub/sub2';

      _.each(tests, function (value, key) {
        var result = instance.getUrl(key);
        expect(result).to.equal(value);
      });
    });
  });
});