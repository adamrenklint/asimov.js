var libPath = '../../lib/';
var PageNodesCollection = require(libPath + 'nodes/PageNodesCollection');
var Test = require(libPath + 'runner/Test');
var _ = require('lodash');

Test.run('nodes/PageNodesCollection', function (test) {

  var instance;

  beforeEach(function (done) {

    instance = new PageNodesCollection(null, {
      'localization': {
        'defaultLangCode': 'en'
      },
      'paths': {
        'content': 'tests/mocks/pages',
        'frameworkPages': 'tests/mocks/pages'
      },
      'muteLog': true
    });

    instance.fetch('tests/mocks/pages').done(function () {
      done();
    });
  });

  test.spec('add (array models, object options)', function () {

    test.when('several unique models with similar ids are passed', function () {

      var length;

      test.beforeEach(function () {

        length = instance.models.length;

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
        expect(instance.models.length).to.equal(5 + length);
      });

      test.it('should sort the collection', function () {

        instance.reset();
        instance.add([{
          'type': 'page',
          'path': process.cwd() + '/' + instance.options.paths.content + '/01-sub/page-1.txt',
          'raw': 'asdf'
        }, {
          'type': 'page',
          'path': process.cwd() + '/' + instance.options.paths.content + '/1241-sub/sub2/page-4.txt',
          'raw': 'asdf'
        }, {
          'type': 'page',
          'path': process.cwd() + '/' + instance.options.paths.content + '/80-foo/page-3.txt',
          'raw': 'asdf'
        }, {
          'type': 'page',
          'path': process.cwd() + '/' + instance.options.paths.content + '/10-foo/bar/page-2.txt',
          'raw': 'asdf'
        }]);

          _.each(instance.models, function (model, index) {
            expect(model.attributes.path).to.contain('page-' + (index + 1));
          });
      });
    });
  });

  test.spec('getUrlForAlias (string url)', function () {

    test.when('url matches page.attributes.alias', function () {

      test.it('should return the redirect url', function () {

        var url = instance.getUrlForAlias('/winnie-the-poo');
        expect(url).to.equal('/');
      });
    });

    test.when('url has no match', function () {

      test.it('should return null', function () {

        var url = instance.getUrlForAlias('/winnie-the-poo-2');
        expect(url).to.be.undefined;
      });
    });
  });

  test.spec('filter (function test, object options)', function () {

    test.when('test is a not function', function () {

      test.itShould.throwError(function () {
        instance.filter(null, {});
      });
    });

    function passIterator () { return true; }

    test.when('test is a function', function () {

      test.when('hash.sortBy is a string', function () {

        test.it('should sort pages by that attribute', function () {

          var sorted = instance.filter(passIterator, {
            'sortBy': 'foo'
          });

          expect(sorted.models[0].attributes.url).to.equal('/zoo');
          expect(sorted.models[sorted.models.length - 1].attributes.url).to.equal('/foo/bar');
        });
      });

      test.when('hash.order is the string "ASC"', function () {

        test.it('should sort children in ascending order', function () {

          var sorted = instance.filter(passIterator, {
            'sortBy': 'foo',
            'order': 'ASC'
          });

          expect(sorted.models[0].attributes.url).to.equal('/zoo');
          expect(sorted.models[sorted.models.length - 1].attributes.url).to.equal('/foo/bar');
        });
      });

      test.when('hash.order is the string "DESC"', function () {

        test.it('should sort children in descending order', function () {

          var sorted = instance.filter(passIterator, {
            'sortBy': 'foo',
            'order': 'DESC'
          });

          expect(sorted.models[0].attributes.url).to.equal('/foo/bar');
          expect(sorted.models[sorted.models.length - 1].attributes.url).to.equal('/zoo');
        });
      });

      test.when('hash.limit is a number', function () {

        test.it('should return max that number of children', function () {

          var limited = instance.filter(passIterator, {
            'limit': 1
          });

          expect(limited.length).to.equal(1);
        });
      });

      test.when('hash.offset is a number', function () {

        test.it('should exclude children with an index lower than hash.offset', function () {

          var offset = instance.filter(passIterator, {
            'sortBy': 'foo',
            'limit': 1,
            'offset': 4
          });

          expect(offset.length).to.equal(1);
          expect(offset.models[0].attributes.url).to.equal('/foo/bar');
        });
      });
    });
  });

  test.spec('childrenOf (string url, object options)', function () {

    test.when('url is not a string', function () {

      test.itShould.throwError(function () {
        instance.childrenOf();
      });
    });

    test.when('url doesn\'t match any page', function () {

      test.itShould.throwError(function () {
        instance.childrenOf('/never-existed');
      });
    });

    test.when('url matches a page', function () {

      test.it('should return an instance of PageNodesCollection', function () {

        var children = instance.childrenOf('/');
        expect(children.filetype).to.equal('page');
      });

      test.when('the page model has children in self.pages', function () {

        test.it('should return each child in the PageNodesCollection', function () {

          var now = new Date();
          var children = instance.childrenOf('/');

          expect(children.get('/foo').attributes.title).to.equal('foo');
          expect(children.get('/zoo').attributes.title).to.equal('zoologogogogy');
        });

        test.it('should not return any other pages in the PageNodesCollection',function () {

          var children = instance.childrenOf('/');
          expect(children.models.length).to.equal(2);
        });
      });

      test.when('the page model has no children in self.pages', function () {

        test.it('should return an empty PageNodesCollection', function () {

          var children = instance.childrenOf('/zoo');
          expect(children.models.length).to.equal(0);
        });
      });

      test.when('options.hidden is false (default)', function () {

        test.it('should not return hidden pages', function () {

          var children = instance.childrenOf('/foo/bar');
          expect(children.models.length).to.equal(0);
        });
      });

      test.when('options.hidden is true', function () {

        test.it('should also return hidden pages', function () {

          var children = instance.childrenOf('/', {
            'hidden': true
          });
          expect(children.models.length).to.equal(3);
          expect(children.get('/hidden').attributes.title).to.equal('Invisible');
        });
      });
    });
  });
});