test([

  '../../lib/nodes/PageNode',
  '../../lib/nodes/PageNodesCollection',
  'lodash'

], function (test) {

  var instance, _, pages;

  test.before(function (done) {

    _ = test.deps.lodash;

    pages = new test.deps.PageNodesCollection(null, {
      'localization': {
        'defaultLangCode': 'en'
      },
      'paths': {
        'content': 'tests/mocks/pages',
        'frameworkPages': 'tests/mocks/pages'
      },
      'muteLog': true
    });

    pages.fetch('tests/mocks/pages').done(function () {
      done();
    });
  });

  test.beforeEach(function () {

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
        instance.mediator.trigger('collection:pages', pages);
      });

      test.it('should return an instance of PageNodesCollection', function () {

        var parent = pages.get('/');
        var children = parent.children();
        expect(children).to.be.instanceOf(test.deps.PageNodesCollection);
      });

      test.when('the page model has children in self.pages', function () {

        test.it('should return each child in the PageNodesCollection', function () {

          var parent = pages.get('/');
          var children = parent.children();

          expect(children.get('/foo').attributes.title).to.equal('foo');
          expect(children.get('/zoo').attributes.title).to.equal('zoologogogogy');
        });

        test.it('should not return any other pages in the PageNodesCollection',function () {

          var parent = pages.get('/');
          var children = parent.children();

          expect(children.models.length).to.equal(2);
        });
      });

      test.when('the page model has no children in self.pages', function () {

        test.it('should return an empty PageNodesCollection', function () {

          var parent = pages.get('/zoo');
          var children = parent.children();

          expect(children.models.length).to.equal(0);
        });
      });
    });
  });
});