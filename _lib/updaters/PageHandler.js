var UpdateHandler = require('./UpdateHandler');
var _super = UpdateHandler.prototype;

module.exports = UpdateHandler.extend({

  'namespace': 'PageHandler',

  'collection': function () {

    var self = this;
    return self.options.pages;
  }
});