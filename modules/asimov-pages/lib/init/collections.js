var collections = {
  'pages': require('../collections/Pages'),
  'styles': require('../collections/StyleSheets'),
  'scripts': require('../collections/Scripts'),
  'templates': require('../collections/Templates')
};

module.exports = function (next, asimov) {

  Object.keys(collections).forEach(function (name) {
    var Constructor = collections[name];
    asimov.register(name, new Constructor());
  });

  next();
};
