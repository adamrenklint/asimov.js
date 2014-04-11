var Helper = require('./Helper');
var _super = Helper.prototype;
var _ = require('lodash');

module.exports = Helper.extend({

  'run': function (src, params) {

    var self = this;

    if (typeof src !== 'string') {
      params = src;
      src = params.src;
    }

    params.src = params.src.indexOf('://') > 0 ? params.src : 'http://player.vimeo.com/video/' + params.src;

    return self.html('iframe', params);
  }
});