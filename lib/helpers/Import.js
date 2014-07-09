var Helper = require('./Helper');
var _super = Helper.prototype;
var _ = require('lodash');

module.exports = Helper.extend({

  'run': function (name, data, params) {

    var self = this;
    params = _.merge({}, data.page, data, params);

    var template = self.templates.findWhere({
      'name': name
    });

    self.assert('object', template, 'Failed to import partial template "' + name  + '" @ ' + self.currentUrl);

    return template.attributes.compiled(params);
  }
});
