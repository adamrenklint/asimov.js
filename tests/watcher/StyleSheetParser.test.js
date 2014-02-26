test('watcher/StyleSheetParser', [

  '../../lib/watcher/StyleSheetParser',
  '../../lib/core/Model',
  'lodash'

], function (runner) {

  var instance, _;

  runner.beforeEach(function () {
    instance = new runner.deps.StyleSheetParser();
    _ = runner.deps.lodash;
  });

  runner.afterEach(function () {
    instance.destroy();
  });

  runner.spec('parse (object model, string raw, object dependencies)', function () {

    runner.when('model is not a valid model', function () {

      runner.it('should throw an error', function () {

        expect(function () {

        }).to.throw(Error);
      });
    });

    runner.when('raw does not contain an @import statement', function () {

      runner.it('should not change the dependency graph');
    });

    runner.when('raw contains @import statements', function () {

      runner.when('the imported stylus file exists', function () {

        runner.it('should register the model as a node of the stylus file in the dependency graph');
      });

      runner.when('the imported stylus file does not exist', function () {

        runner.it('should throw error');
      });
    });

    runner.when('raw is not a string',  function () {

      runner.it('should use model.attributes.raw as raw');
    });
  });
});