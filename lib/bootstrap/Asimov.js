var Base = require('../core/Base');
var _super = Base.prototype;

var npath = require('path');
var path = __dirname;
var cluster = require('cluster');

process.env.PORT = process.env.PORT || 3003;

var isModule = path.indexOf('node_modules/asimov.js/bin') >= 0 || path.indexOf('node_modules/asimov.js/lib') >= 0;
var frameworkDir = path.replace('/lib/bootstrap', '');

module.exports = Base.extend({

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);

    var options = self.options;
    options.meta = require(npath.join(process.cwd(), 'package.json'));
    options.pkg = require('../../package.json');

    options.isModule = isModule;
    options.frameworkDir = frameworkDir;

    self.options = options;

    self.loadFirstDefaults();
  },

  'start': function () {

    var self = this;

    self.loadLastDefaults();

    var loaderPath = cluster.isMaster ? '../core/Loader' : '../server/Server';
    var Bootstrap = require(loaderPath);
    var bootstrap = new Bootstrap(self.options);
    
    return this;
  }
});