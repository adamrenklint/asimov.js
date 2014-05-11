var Base = require('../core/Base');
var _ = require('lodash');
var marked = require('marked');
var handlebars = require('handlebars');
var _super = Base.prototype;

module.exports = Base.extend({

  'namespace': 'Render',

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);
  },

  'clean': function (raw) {

    var self = this;

    raw =

    return raw;
  },

  'run': function (model) {

    var self = this;
    var deferred = self.deferred();
    var options = self.options;
    var templates = options.templates;

    self.mediator.trigger('pre:render:page', model);












    model.set(attributes, { 'silent': true });



    self.mediator.trigger('post:render:page', model);
    model.trigger('change:rendered', model);

    deferred.resolve(model);

    return deferred;
  }
});
