module.exports = function (next, asimov, model) {

  console.log('page processor', model.id);
  next();
};
