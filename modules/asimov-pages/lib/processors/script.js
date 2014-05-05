module.exports = function (next, asimov, model) {

  console.log('script processor', model.id);
  next();
};
