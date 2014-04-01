var Helper = require('../render/Helper');
var _super = Helper.prototype;
var _ = require('lodash');

module.exports = Helper.extend({

  'run': function (hash) {

    var self = this;
    hash = hash || {};

    return JSON.stringify(hash);
  }
});