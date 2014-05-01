var Klass = require('../../asimov-core').Klass;
var _super = Klass.prototype;

var npath = require('path');
var meta = require(npath.join(process.cwd(), 'package.json'));

module.exports = Klass.extend({

  'namespace': 'test',

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);

    self.setup();
  },

  'setup': function () {

    var self = this;
  },

  'run': function () {

    var self = this;
    self.logger.pending(self.namespace, 'Running tests for "' + meta.name + '" ' + meta.version);
  }
});