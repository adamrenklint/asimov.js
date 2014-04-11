var Helper = require('./Helper');
var _super = Helper.prototype;
var _ = require('lodash');

module.exports = Helper.extend({

  'run': function (params) {

    var self = this;
    params = params || {};

    return JSON.stringify(params);
  }
});