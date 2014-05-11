var Base = require('../core/Base');
var _super = Base.prototype;

module.exports = Base.extend({

  'namespace': 'server',

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);

    self.pages = self.options.pages;
    self.urls = self.options.urls;
    self.server = self.options.server;
  }
});