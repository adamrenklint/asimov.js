var fs = require('fs');
var child = require('child_process');

function getExisting (path) {

  var existing = {};

  var folders = fs.readdirSync(path);
  folders.forEach(function (folderPath) {
    var pkgPath = folderPath + '/package.json';
    var pkg;

    try {
      pkg = require(pkgPath);
    }
    catch (e) {}

    pkg && (existing[pkg.name] = pkg.version);
  });

  return existing;
}

function shouldInstall (next, current) {
  return next !== current;
}

function check (toInstall, dependencies, existing, path) {

  toInstall = toInstall || {};

  Object.keys(dependencies).forEach(function (name) {
    var version = dependencies[name];
    var current = existing[name];
    if (shouldInstall(version, current)) {
      toInstall[name] = version;
    }
  });

  return toInstall;
}

function install (dependencies, path, before, done) {

  path = path.replace(/node_modules$/, '');
  var queue = Object.keys(dependencies) || [];
  var count = {};
  var started = new Date();

  function next () {

    if (queue.length) {
      var name = queue.shift();
      var version = dependencies[name];
      var signature = name + '@' + version;

      if (!before(name, version)) return next();

      var c = child.exec('cd ' + path + ' && npm install ' + signature, function (err) {

        if (err) throw new Error('Failed to install ' + signature + ': ' + err);

        next();
      });
    }
    else {
      done({
        'count': count,
        'started': started,
        'dependencies': dependencies
      });
    }
  }

  next();
}

exports.install = function (options, done) {

  options = options || {};
  if (typeof options === 'function') done = options;
  var path = options.path || (process.cwd() + '/package.json');
  if (!path ||  typeof path !== 'string') throw new TypeError('Invalid path');

  var installed = {};
  var pkg = require(path);
  var lazyDependencies = pkg.lazyDependencies;
  options.groups = options.groups || Object.keys(lazyDependencies) || [];
  var before = options.before || function () { return true; };

  var installPath = path.replace('/package.json', '/node_modules');
  if (!fs.existsSync(installPath)) {
    fs.mkdirSync(installPath);
  }

  var existing = getExisting(installPath);

  var toInstall = check({}, pkg.dependencies, existing, installPath);

  options.groups.forEach(function (group) {
    toInstall = check(toInstall, lazyDependencies[group], existing, installPath);
  });

  install(toInstall, installPath, before, done);
};