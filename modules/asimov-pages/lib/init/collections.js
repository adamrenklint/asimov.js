module.exports = function (next, asimov) {

  [
    'Pages',
    'StyleSheets',
    'Scripts',
    'Templates',
    'Helpers',
    'SiteData'
  ].forEach(function (ClassName) {
    var Constructor = require('../collections/' + ClassName);
    var name = ClassName[0].toLowerCase() + ClassName.substr(1);
    asimov.register(name, new Constructor(), 'pages');
  });

  next();
};
