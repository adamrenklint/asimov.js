var bootstrap = require(process.cwd() + '/index');

module.exports = function startCommand (next) {
  bootstrap.start(next);
};
