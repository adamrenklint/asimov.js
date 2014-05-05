var asimov = require('../../../../index');

module.exports = function (next, asimov, model) {

  var attributes = model.toJSON();
  if (attributes.type !== 'page') return next();

  attributes.page = attributes;

  attributes.pkg = asimov.config.pkg;
  attributes.meta = asimov.config.meta;
  attributes.site = asimov.siteData.attributes;

  if (attributes.langCode !== asimov.config.defaultLangCode && !attributes.inherits) {
    attributes.inherits = attributes.url.toString().replace('/' + attributes.langCode, '');
  }

  if (attributes.inherits) {
    var parent = asimov.pages.get(attributes.inherits);
    attributes.parent = parent.attributes;
  }

  model.set(attributes, { 'silent': true });
  next();
};
