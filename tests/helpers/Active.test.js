var libPath = '../../lib/';
var Active = require(libPath + 'helpers/Active');
var Collection = require(libPath + 'core/Collection');
var Test = require(libPath + 'runner/Test');

Test.run('helpers/Active', function (test) {

  var instance;

  beforeEach(function () {

    var collection = new Collection();

    instance = new Active({
      'name': 'active',
      'queue': collection,
      'pages': collection
    });

    instance.currentUrl = '/blog';
  });

  test.spec('run (string url, string value, object options)', function () {

    test.when('url is not a string', function () {

      test.itShould.throwError(function () {
        instance.run(null, 'string');
      });
    });

    test.when('url is a string', function () {

      test.when('value is a string', function () {

        test.when('url matches the rendering page', function () {

          test.it('should return the passed value', function () {
            var result = instance.run('/blog', 'string');
            expect(result).to.equal('string');
          });
        });

        test.when('url doesn\'t match rendering page', function () {

          test.it('should return an empty string', function () {
            var result = instance.run('/blog2', 'string');
            expect(result).to.equal('');
          });
        });
      });

      test.when('value is not a string', function () {

        test.when('options.fn is a function', function () {

          test.when('url matches the rendering page', function () {

            test.it('should return the passed value', function () {

              var result = instance.run('/blog', {
                'hash': {},
                'fn': function () {
                  return '<div id="active">yo</div>';
                }
              });

              expect(result).to.equal('<div id="active">yo</div>');
            });
          });

          test.when('url doesn\'t match rendering page', function () {

            test.it('should return an empty string', function () {

              var result = instance.run('/blog2', {
                'hash': {},
                'fn': function () {
                  return '<div id="active">yo</div>';
                }
              });

              expect(result).to.equal('');
            });
          });
        });

        test.when('options.fn is not a function', function () {

          test.it('should return an empty string', function () {

            var result = instance.run('/blog2', {
              'hash': {},
              'fn': null
            });

            expect(result).to.equal('');
          });
        });
      });
    });
  });
});