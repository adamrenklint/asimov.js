var libPath = '../../lib/';
var TemplateParser = require(libPath + 'parsers/TemplateParser');
var Model = require(libPath + 'core/Model');
var Test = require(libPath + 'runner/Test');
var _ = require('lodash');

Test.run('parsers/TemplateParser', function (test) {

  var instance;

  test.beforeEach(function () {
    instance = new TemplateParser({
      'paths': {
        'templates': ['tests/mocks/templates']
      }
    });
  });

  test.afterEach(function () {
    instance.destroy();
  });

  test.spec('initialize (object options)', function () {

    // test.when('options.paths.styles is not an array', function () {

    //   test.it('should throw an error', function () {

    //     expect(function () {
    //       new StyleSheetParser();
    //     }).to.throw(Error);
    //   });
    // });
  });

  test.spec('parse (object model, string raw, object dependencies)', function () {

    test.it('should add model as a dependency of itself', function () {

      var templatePath = 'something/template.tmpl';
      var model = new Model({
        'path': templatePath,
        'raw': 'blabla'
      });
      var dependencies = new Model();
      instance.parse(model, null, dependencies);

      var wasFound = false;

      _.each(dependencies.attributes, function (arr, path) {
        if (path.indexOf(templatePath) >= 0) {
          _.each(arr, function (dep) {
            if (dep.attributes.path.indexOf(templatePath) >= 0) {
              wasFound = true;
            }
          });
        }
      });

      expect(wasFound).to.be.true;
    });

    test.when('the template includes a partial', function () {

      test.it('should add model as a dependency for the partial', function () {

        var templatePath = 'something/template.tmpl';
        var model = new Model({
          'path': templatePath,
          'raw': 'blabla {{import "simple"'
        });
        var dependencies = new Model();
        instance.parse(model, null, dependencies);

        var wasFound = false;

        _.each(dependencies.attributes, function (arr, path) {
          if (path.indexOf('templates/simple') >= 0) {
            _.each(arr, function (dep) {
              if (dep.attributes.path.indexOf(templatePath) >= 0) {
                wasFound = true;
              }
            });
          }
        });

        expect(wasFound).to.be.true;
      });
    });

    test.when('the template includes multiple levels of partials', function () {

      test.it('should add model as a dependency for the nested partial', function () {

        var templatePath = 'something/template.tmpl';
        var model = new Model({
          'path': templatePath,
          'raw': 'blabla {{import "includer"'
        });
        var dependencies = new Model();
        instance.parse(model, null, dependencies);

        var wasFound = false;

        _.each(dependencies.attributes, function (arr, path) {
          if (path.indexOf('templates/simple') >= 0) {
            _.each(arr, function (dep) {
              if (dep.attributes.path.indexOf(templatePath) >= 0) {
                wasFound = true;
              }
            });
          }
        });

        expect(wasFound).to.be.true;
      });
    });

    test.when('the template imports a nested partial with the same name as another partial', function () {

      test.it('should find and use the right partial', function () {

        var templatePath = 'something/template.tmpl';
        var model = new Model({
          'path': templatePath,
          'raw': 'blabla {{import "includingNested"}} asda'
        });
        var dependencies = new Model();
        instance.parse(model, null, dependencies);

        var wasFound = false;

        _.each(dependencies.attributes, function (arr, path) {
          if (path.indexOf('templates/nested/simple.tmpl') >= 0) {
            _.each(arr, function (dep) {
              if (dep.attributes.path.indexOf(templatePath) >= 0) {
                wasFound = true;
              }
            });
          }
        });

        expect(wasFound).to.be.true;
      });
    });

    test.when('the template uses the site variable', function () {

      test.it('should add model as a dependency for all loaded config files');
    });
  });
});