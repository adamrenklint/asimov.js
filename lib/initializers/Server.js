var Initializer = require('../core/Initializer');
var Server = require('../server/Server');
var _ = require('lodash');
var _super = Initializer.prototype;

module.exports = Initializer.extend({

  'run': function (next) {

    var self = this;
    var options = self.options;

    var server = new Server(options);
    var serverName = server.start();

    if (process.argv.indexOf('--open') > 0) {
      _.defer(function () {
        self.child.execute('open ' + serverName);
      });
    }

    next();
  }
});