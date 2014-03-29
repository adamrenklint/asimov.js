var Base = require('../core/Base');
var _ = require('lodash');
var handlebars = require('handlebars');
var uglify = require('uglify-js');
var requirejs = require('requirejs');
var _super = Base.prototype;
var npath = require('path');

module.exports = Base.extend({

  'namespace': 'Render',

  'run': function (model) {

    var self = this;
    var deferred = self.deferred();
    var attributes = model.attributes;
    var path = attributes.path;

    if (!self.filesystem.pathExists(path)) {

      throw new Error('Cannot find script @ ' + path);
    }

    function save (raw) {

      var script = uglify.minify(raw, {
        'fromString': true
      });

      model.set({
        'rendered': script.code
      });

      deferred.resolve(model);
    }

    if (!attributes.bundle) {

      save(attributes.raw);
    }
    else {

      var outPath = npath.join(self.options.outputPath, attributes.url);
      // console.log('lib/' + attributes.name)

      console.log('TODO: make browserify bundles here');
      deferred.resolve(model);
      // requirejs.optimize({
      //   'name': 'lib/' + attributes.name,
      //   'out': outPath,
      //   'include': [
      //     self.options.frameworkDir + '/vendor/almond'
      //   ]
      // }, function (err) {

      //   var file = self.filesystem.readFile(outPath);
      //   save(file);
      // });
    }

    return deferred;
  }
});