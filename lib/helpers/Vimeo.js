var Helper = require('../render/Helper');
var _super = Helper.prototype;
var _ = require('lodash');

module.exports = Helper.extend({

  'run': function (src) {

    var self = this;
    var options = self.opts(arguments);
    var hash = options.hash;

    hash.src = _.isString(src) ? src : hash.src;
    hash.src = hash.src.indexOf('://') > 0 ? hash.src : 'http://player.vimeo.com/video/' + hash.src;

    return self.html('iframe', hash);
  }
});