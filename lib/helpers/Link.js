var Helper = require('../render/Helper');
var _super = Helper.prototype;
var _ = require('lodash');

module.exports = Helper.extend({

  'run': function (href, innerText) {

    var self = this;
    var options = self.opts(arguments);
    var hash = options.hash;

    hash.href = _.isString(href) ? href : hash.href;
    hash.text = _.isString(innerText) && innerText || hash.text || hash.title || hash.href;

    if (_.isFunction(options.fn)) {
      var result = options.fn(hash);
      if (result.indexOf('<') >= 0 && result.indexOf('>') >= 0) {
        hash.html = result;
      }
      else {
        hash.text = result;
      }
    }
    hash.title = hash.title || hash.text;

    return self.html('a', hash);
  }
});