var Helper = require('./Helper');
var _super = Helper.prototype;
var _ = require('lodash');

function returnTrue () {
  return true;
}

module.exports = Helper.extend({

  'run': function (params, block) {

    var self = this;

    self.assert('function', block, 'Inner template block must be a function');

    return self.pages.filter(returnTrue, params).map(function (child) {
      self.registerDependency(self.currentPage, child);
      return block(child.attributes);
    }).join('');
  }
});