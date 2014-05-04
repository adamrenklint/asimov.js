var UpdateHandler = require('./UpdateHandler');
var _ = require('lodash');

module.exports = UpdateHandler.extend({

  'namespace': 'ScriptHandler',

  'collection': function (path) {

    var self = this;
    var collection = false;

    _.each(self.options.paths.helpers, function (helpersPath) {
      if (path.indexOf(helpersPath) === 0) {
        collection = self.options.helpers;
      }
    });

    return collection;
  }
});