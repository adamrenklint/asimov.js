var test = require('asimov-test');
var index = require('../index');

test('module index', function (test) {

  test.it('should export a bootstrap function', function () {

    expect(index.start).to.be.a('function');
  });

  test.it('should set global.asimov to itself', function () {

    expect(index).to.equal(global.asimov);
  });

  [
    'Base',
    'Asimov',
    'Master',
    'Worker',
    'CommandLineInterface',
    'Sequencer'
  ].forEach(function (name) {

    test.it('should export the "' + name + '" class', function () {

      expect(index[name]).to.be.a('function');
    });
  });

  [
  'Configurable'
  ].forEach(function (name) {

    test.it('should export the "' + name + '" mixin', function () {

      expect(index.mixins[name]).to.be.a('object');
      expect(index.mixins[name].Behavior).to.be.a('object');
    });
  });
});
