module.exports = function (next, asimov, model) {

  console.log('styleSheet processor', model.id);
  next();
};
