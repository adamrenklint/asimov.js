test([

  '../../lib/nodes/PageNode',
  '../../lib/nodes/PageNodesCollection',
  'lodash'

], function (test) {

  var instance, _, pages;

  test.before(function (done) {

  });

  test.beforeEach(function () {

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

  test.spec('parseUrl (string url)', function () {

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
        var result = instance.parseUrl(key);
        expect(result).to.equal(value);
      });
    });
  });

  test.spec('children ()', function () {

    test.when('self.pages is not an instance of PageNodesCollection', function () {

      test.itShouldThrowError(function () {

        instance.children();
      });
    });

    test.when('a pages collection is defined', function () {

      test.beforeEach(function () {

        var pages = new test.deps.PageNodesCollection();
        instance.mediator.trigger('collection:pages', pages);
      });

      test.it('should return an instance of PageNodesCollection', function () {

        var children = instance.children();
        expect(children).to.be.instanceOf(test.deps.PageNodesCollection);
      });

      test.when('the page model has children in self.pages', function () {

        test.it('should return each child in the PageNodesCollection', function () {

          // var children = instance.children();
          // expect(children).to.be.instanceOf(test.deps.PageNodesCollection);
        });

        test.it('should not return any other pages in the PageNodesCollection');
      });

      test.when('the page model has no children in self.pages', function () {

        test.it('should return an empty PageNodesCollection');
      });
    });
  });
});