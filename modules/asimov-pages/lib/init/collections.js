var collections = {
  'pages': require('../collections/Pages'),
  'styles': require('../collections/StyleSheets'),
  'scripts': require('../collections/Scripts'),
  'templates': require('../collections/Templates'),
  'helpers': require('../collections/Helpers'),
  'siteData': require('../collections/SiteData')
};

module.exports = function (next, asimov) {

  Object.keys(collections).forEach(function (name) {
    var Constructor = collections[name];
    asimov.register(name, new Constructor(), 'pages');
  });

  next();
};
