var fs = require('fs');

function getLinesInPath (path) {

  var count = 0;

  // console.log('getLinesInPath', path)

  if (!fs.existsSync(path)) {
    return count;
  }
  else if (fs.statSync(path).isDirectory()) {
    var files = fs.readdirSync(path);
    files.forEach(function (filePath) {
      count += getLinesInPath(path + '/' + filePath);
    });
  }
  else if (path.match(/\.js$/)) {
    count += getLinesInFile(path);
  }

  return count;
}

function getLinesInFile (path) {
  return 1;
}

module.exports = function () {
  console.log(getLinesInPath(process.cwd() + '/lib'));
};
