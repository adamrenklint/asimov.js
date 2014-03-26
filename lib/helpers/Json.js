var TemplateHelper = require('../render/TemplateHelper');
var _super = TemplateHelper.prototype;

module.exports = TemplateHelper.extend({

  'run': function (hash) {

    var self = this;
    hash = hash || {};

    return JSON.stringify(hash);
  }
});