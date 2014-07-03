var Helper = require('./Helper');
var _super = Helper.prototype;
var _ = require('lodash');

module.exports = Helper.extend({

  'run': function (href, innerText, params, block) {

    var self = this;

    if (typeof href !== 'string') {
      block = params;
      params = innerText;
      innerText = null;
    }

    if (typeof innerText !== 'string') {
      block = params;
      params = innerText;
      innerText = params.text || params.title || params.href || href;
    }

    params.href = href || params.href;
    params.text = innerText;

    if (params.href[0] !== '/' && params.href.indexOf('http') !== 0) {
      params.href = 'http://' + params.href;
    }

    if (_.isFunction(block)) {
      var result = block(params);
      if (result.indexOf('<') >= 0 && result.indexOf('>') >= 0) {
        params.html = result;
      }
      else {
        params.text = result;
      }
    }
    params.title = params.title || params.text;

    delete params.page;

    return self.html('a', params);
  }
});
