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

  'getFlags': function (args) {

    var self = this;
    var commandIndex = args.indexOf(self.namespace);
    var grep = args[commandIndex + 1];
    var reporterFlag, reporterFlagIndex;

    self.ignoreReporterFlag || args.forEach(function (arg, index) {
      if (arg.indexOf('--') === 0) {
        reporterFlagIndex = index;
        reporterFlag = arg.replace('--', '');
      }
    });
    if (reporterFlagIndex === commandIndex + 1) grep = null;

    return {
      'reporter': reporterFlag || 'dot',
      'grep': grep
    };
  },

  'run': function () {

    var self = this;
    self.logger.pending(self.namespace, 'Running tests for "' + meta.name + '" ' + meta.version);

    var flags = self.getFlags(process.argv);
    console.log(flags)
  }
});