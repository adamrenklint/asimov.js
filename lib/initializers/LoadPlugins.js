var Initializer = require('./Initializer');
var _super = Initializer.prototype;

module.exports = Initializer.extend({

  'run': function (next) {

    var self = this;
    var options = self.options;

    self.logger.since(self.namespace, 'Loaded 0 plugin(s)', new Date());

    next();
  }
});