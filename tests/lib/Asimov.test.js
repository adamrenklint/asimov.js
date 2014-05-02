var test = require('asimov-test');

test('lib/Asimov', function (test) {

  test.spec(function () {

    test.it('should be true', function () {
      expect(true).to.be.false;
    });
  });
});