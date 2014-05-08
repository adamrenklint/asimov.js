var Helper = require('./Helper');
var _super = Helper.prototype;
var _ = require('lodash');

module.exports = Helper.extend({

  'run': function (name, data, params) {

    var self = this;
    params = _.merge({}, data, params);

    var template = self.templates.findWhere({
      'name': name
    });

    self.assert('object', template, 'Failed to import partial template "' + name  + '" @ ' + asimov.currentPage.attributes.path);

    return template.attributes.compiled(params);
  }
});
