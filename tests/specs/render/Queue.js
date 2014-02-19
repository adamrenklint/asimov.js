test('lib/render/Queue', [

  '../../../lib/render/Queue'

], function (runner) {

  var instance;

  runner.beforeEach(function () {
    instance = new runner.deps.Queue();
  });

  runner.spec('add (model job)', function () {

    runner.when('job is not a valid model', function () {

      runner.it('should throw an error', function () {

        expect(function () {
          instance.add(null);
        }).to.throw(Error);
      });
    });
  });
});