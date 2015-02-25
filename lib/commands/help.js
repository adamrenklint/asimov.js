var child_process = require('child_process');

function fetchLocalCommands (callback) {
  callback();
}

function fetchGlobalNewTypes (callback) {
  var types = [];
  child_process.exec('npm list -g', function (err, stdout) {
    stdout.split('\n').forEach(function (line) {
      line = '  ├─┬ asimov-generate-foo barabr';
      if (line.indexOf('asimov-generate-') > 0) {
        var type = line.split('asimov-generate-')[1].split(' ')[0];
        if (types.indexOf(type) === -1) {
          types.push(type);
        }
      }
    });

    callback();
  });
}

function fetchInstalledCommands (callback) {

  fetchLocalCommands(function (err, local) {
    fetchGlobalNewTypes(function (err, types) {
      callback({
        'local': local,
        'generators': types
      });
    });
  });
}

function helpCommand (next) {

  fetchInstalledCommands(function (err, commands) {

    console.log('\n\n\n  Usage:\n\n',

    '    asimov [start]     start application\n',
    '    asimov debug       start app with verbose logging\n',
    '    asimov test        run unit and integration tests\n',
    '    asimov loc         count lines of code in /lib\n',
    '    asimov help        show these instructions\n\n',

    '    asimov new         create app boilerplate\n',

    '\n\n\n');

    next();
  });
}

module.exports = helpCommand;