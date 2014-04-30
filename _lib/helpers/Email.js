var Helper = require('./Helper');
var _super = Helper.prototype;
var _ = require('lodash');

module.exports = Helper.extend({

  'run': function (adress, params, block) {

    var self = this;

    if (typeof adress !== 'string') {
      block = params;
      params = adress;
      adress = params.adress || params.href || params.src || params.email;
    }

    params.href = 'mailto:' + adress;

    if (params.subject) {
      params.href += '?subject=' + encodeURIComponent(params.subject);
    }

    if (_.isFunction(block)) {
      params.html = block(params);
    }
    else {
      params.text = params.text || params.title || adress;
    }

    params.title = params.title || params.text || adress || _.escape(params.html);

    delete params.adress;
    delete params.subject;

    return self.html('a', params);
  }
});