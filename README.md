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

And any other command, you execute the same way. For the next example, we're going to build this command:

```
asimov loc
```

## Create a project

Let's say we want to extend asimov.js with a new command that counts the lines of code in the lib folder. We could later publish it to npm, and use it in other asimov.js projects as a plugin.

We create a basic npm module structure, and add a ```commands``` folder and ```loc.js``` - the actual command we'll be loading.

```
/asimov-loc
  /lib
    /commands
      loc.js
  index.js
  package.json
```

## Create a new command

In ```lib/commands/loc.js```, we add the code to recursive count the lines of javascript code in the ```lib``` folder.

```
someting thing
```

## Making it a plugin

index.js

---

Made by [Adam Renklint](http://adamrenklint.com), Berlin 2014. [MIT licensed](https://github.com/adamrenklint/asimov.js/blob/master/LICENSE).
