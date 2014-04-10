var Initializer = require('./Initializer');
var _super = Initializer.prototype;

module.exports = Initializer.extend({

  'run': function (next) {

    var self = this;
    var options = self.options;

    self.bindTo(self.mediator, 'pre:render:page', 'computeAttributes');

    next();
  },

  'computeAttributes': function (page) {

    var self = this;
    var attributes = page.attributes;
    var children = page.children();

    attributes.childCount = children.length;
    attributes.hasChildren = !!attributes.childCount;

    page.set(attributes, {
      'silent': true
    });
  }
});