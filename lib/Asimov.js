var Base = require('./Base');
var _super = Base.prototype;
var npath = require('path');

var Config = require('./Config');

module.exports = Base.extend({

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);

    self.options.pkg = require(npath.join(self.options.frameworkDir, 'package.json'));
    self.options.meta = require(npath.join(process.cwd(), 'package.json'));
  },

  'start': function () {

    var self = this;
    self.started = new Date();

    self.logger.pending('main', 'Loading asimov.js @ ' + self.options.pkg.version);
    self.logger.log('main', 'The time is ' + self.started);

    var config = self.config = new Config(self.options);
    config.json.outputPath = config.json.paths.outputDir;
    _.merge(self.options, config.json);

    // console.log('starting...');
  }
});