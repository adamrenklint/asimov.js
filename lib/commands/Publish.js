var Test = require('./Test');
var _super = Test.prototype;
var npath = require('path');

module.exports = Test.extend({

  'allowGrep': false,

  'getHeader': function () {

    var self = this;
    return 'Publishing "' + self.options.meta.name +'" ' + self.options.meta.version + ' to NPM';
  },

  'exit': function (code) {

    var self = this;
    self.filesystem.recursiveDelete(npath.join(process.cwd(), 'tests/temp'));

    self.publish().then(self.tag).then(function () {
      self.logger.since(self.namespace, self.getHeader().replace('Publishing', 'Published'), self.started);
    });
  },

  'publish': function () {

    var self = this;
    var publishCommand = 'npm publish';

    if (self.options.args.indexOf('--beta')) {
      publishCommand += '@beta';
    }

    return self.child.execute(publishCommand);
  },

  'tag': function () {

    var self = this;
    var deferred = self.deferred();

    self.child.execute('git tag "v' + self.options.meta.version + '"').done(function () {
      self.child.execute('git push --tags').done(deferred.resolve.bind(resolve));
    });

    return deferred.promise();
  }
});