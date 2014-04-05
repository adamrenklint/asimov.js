var Test = require('./Test');
var _super = Test.prototype;
var npath = require('path');

module.exports = Test.extend({

  'ignoreGrep': true,
  'ignoreReporterFlag': true,

  'getHeader': function () {

    var self = this;
    return 'Publishing "' + self.options.meta.name +'" ' + self.options.meta.version + ' to NPM';
  },

  'exit': function (code) {

    var self = this;
    self.filesystem.recursiveDelete(npath.join(process.cwd(), 'tests/temp'));

    self.publish().then(function (result) {

      if ((typeof result === 'string' && result.indexOf('+ ' + self.options.meta.name + '@' + self.options.meta.version) < 0) || typeof result !== 'string') {
        self.error(['Failed to publish to NPM:', result]);
      }

      self.tag().done(function () {
        self.logger.since(self.namespace, self.getHeader().replace('Publishing', 'Published'), self.started);
      });
    });
  },

  'publish': function () {

    var self = this;
    var publishCommand = 'npm publish';

    if (self.options.args.indexOf('--beta')) {
      publishCommand += ' --tag beta';
    }

    return self.child.execute(publishCommand);
  },

  'tag': function () {

    var self = this;
    var deferred = self.deferred();

    self.child.execute('git tag "v' + self.options.meta.version + '"').done(function () {
      self.child.execute('git push --tags').done(function () {
        self.logger.log(self.namespace, 'Created and pushed git tag "v' + self.options.meta.version + '"');
        deferred.resolve();
      });
    });

    return deferred.promise();
  }
});