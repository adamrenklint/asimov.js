asimov.js
================

[![NPM version](https://badge.fury.io/js/asimov.js.png)](http://badge.fury.io/js/asimov.js) [![Build Status](https://travis-ci.org/adamrenklint/asimov.js.png?branch=master)](https://travis-ci.org/adamrenklint/asimov.js) [![Code Climate](https://codeclimate.com/github/adamrenklint/asimov.js.png)](https://codeclimate.com/github/adamrenklint/asimov.js) [![Dependency Status](https://david-dm.org/adamrenklint/asimov.js.png?theme=shields.io)](https://david-dm.org/adamrenklint/asimov.js)

**A better toolkit for building awesome websites and apps**

asimov.js is at its core only two simple things: a command line interface that loads and executes command scripts in your project and node_modules folder, and a plugin interface for adding initializers and extend the app lifecycle.

On it's own, asimov.js doesn't really do much - it leaves all the heavy lifting to plugins. The two most basic ones are asimov-pages and asimov-server. Together you get an awesome static site generator with extendable, chained processing and a high-performance clustered server, with express-compatible middleware.

## Command line interface

Install asimov.js globally to use the cli

```
npm install -g asimov
```

Start your project and execute any registered initializers. This assumes your ```index.js``` exports a member function called ```start```. More on that later.

```
asimov start
```

And any other command, you execute the same way. Later in this document, you'll learn to build a command that counts the lines of code.

```
asimov loc
```

## Create a new project

So let's create our very first asimov.js app, a tiny thing that will load an initializer that logs a message.

```
/hello-world
  /lib
    /init
      logMessage.js
  index.js
  package.json
```

```logMessage.js``` should export an *initializer factory*, a function that takes options and returns another function, the actual *initializer*. The initializer function is passed a ```next``` function that continues the chain.

```javascript
module.exports = function (options) {
  return function (next) {
    console.log("Hello world");
    next();
  };
};
```

Then, we add some bootstrap code in ```index.js```.

```javascript
var asimov = require('asimov');
var logMessage = require('./lib/logMessage');

// This is our plugin hook, the function that other modules
// can use to load our modules functionality
module.exports = function (options) {
  asimov.init(logMessage(options));
};

// The "start" method should bootstrap your app
// and start asimov.js
module.exports.start = function start () {

  asimov
    .use(module.exports())
    .start();
};

// If we are not loaded as a plugin, start the app
module.parent || module.exports.start();
```

## Create a new command

Let's say we want to extend asimov.js with a new command that counts the lines of code in the ```lib``` folder. We could later publish it to npm, and use it in other asimov.js projects as a plugin.

Create a basic npm module structure, and add ```lib/commands/loc.js``` - it will be loaded when you call ```asimov loc``.

```
/asimov-loc
  /lib
    /commands
      loc.js
  index.js
  package.json
```

In ```lib/commands/loc.js```, we add the code to recursive count the lines of javascript code in the ```lib``` folder.

```javascript
var asimov = require('../../index');

function countLinesInPath (path) {
  // A function that recursively counts
  // the lines in all the javascript files
  // You'll need to figure that part out on your own
}

module.exports = function () {

  // Some basic setup
  var path = process.cwd() + '/lib';
  var namespace = 'loc';
  var started = new Date();

  // And get the count
  var count = countLinesInPath(path);

  // Log the result, and how long it took to count
  var message = 'Counted ' + count + ' lines in ' + path;
  asimov.logger.since(namespace, message, started);
};
```
ß
---

Made by [Adam Renklint](http://adamrenklint.com), Berlin 2014. [MIT licensed](https://github.com/adamrenklint/asimov.js/blob/master/LICENSE).
