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

    attributes.isHomepage = attributes.url === '/';

    // the langcodes that need to be available for wunderlist.com
    var langCodes = ['ja', 'zh', 'zh_TW', 'de', 'ru', 'es', 'fr', 'pt_BR', 'ko'];
    langCodes.forEach(function (code) {
      if (attributes.url === ('/' + code)) {
        attributes.isHomepage = true;
      }
    });

    attributes.isNotFoundPage = attributes.url === '/404';
    attributes.isVisible = !page.isHidden();

    attributes.childCount = children.length;
    attributes.hasChildren = !!attributes.childCount;

    page.set(attributes, {
      'silent': true
    });
  }
});
