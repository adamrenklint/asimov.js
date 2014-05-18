var test = require('asimov-test');
var Configurable = require('../../../lib/mixins/Configurable');
var Base = require('../../../lib/Base');

test('lib/mixins/Configurable', function (test) {

  var instance;

  var Config = Base.extend({
    'mixins': Configurable
  });

  beforeEach(function () {
    instance = new Config({
      'muteLog': true
    });
  });

  afterEach(function () {
    instance.destroy();
  });
});
