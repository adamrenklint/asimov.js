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

    params.src = typeof src === 'string' ? src : params.src;

    self.assert('string', params.src, 'Invalid source url');

    params.src = params.src.indexOf('://') > 0 ? params.src : '//www.youtube.com/embed/' + params.src + '?feature=player_embedded';

    return self.html('iframe', params);
  }
});