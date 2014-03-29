var Base = require('../core/Base');
var _ = require('lodash');
var handlebars = require('handlebars');
var uglify = require('uglify-js');
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
        'rendered': script.code,
        'unminified': raw
      });

      deferred.resolve(model);
    }

    var outPath = npath.join(self.options.outputPath, attributes.url);
    var outDir = outPath.split('/');
    outDir.pop();
    outDir = outDir.join('/');

    self.filesystem.forceExists(outDir);

    var frameworkDir = self.options.frameworkDir === 'lib' ? '' : self.options.frameworkDir;
    var browserifyCommand = npath.join(process.cwd(), frameworkDir, 'node_modules/browserify/bin/cmd.js ' + attributes.path + ' > ' + outPath);

    self.child.execute(browserifyCommand)
      .done(function () {

        var file = self.filesystem.readFile(outPath);

        if (attributes.insertConstructor) {
          file = file.replace('{1:[function(require,module,exports){', '{1:[function(require,module,exports){setTimeout(function(){new module.exports();},1);');
        }

        save(file);
      })
      .fail(function (err) {

        throw new Error('Failed to render script bundle @ ' + attributes.url + ' > ' + err);
      });

    return deferred;
  }
});