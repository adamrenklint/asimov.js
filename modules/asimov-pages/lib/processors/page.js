var asimov = require('../../../../index');

module.exports = function (next, asimov, model) {

  var attributes = model.toJSON();
  if (attributes.type !== 'page') return next();
  
  var raw = attributes.raw;

  var template = asimov.templates.get(attributes.template);

  if (!template) {
    throw new Error('Failed to render ' + attributes.path + ' - missing template "' + attributes.template + '"');
  }

  next();
};
