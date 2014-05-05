module.exports = function (next, asimov, model) {

  var attributes = model.toJSON();
  if (attributes.type !== 'styleSheet') return next();

  next();
};
