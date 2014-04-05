# Changelog

## 0.15.3

  - **Released ?**
  - Removed version from *meta generator** tag, a security faux pas
  - Omitting ```[template]``` in ```ajs new page [url] [template]``` now defaults to ```page``` [#179](https://github.com/adamrenklint/asimov.js/issues/179)
  - Server now also reports throughput (requests per minute) every 15 seconds [#181](https://github.com/adamrenklint/asimov.js/issues/181)

## 0.15.2

  - **Released Saturday April 5th, 2014 @ 4.55pm**
  - Fixed issue with default error stylesheet not being namespaced and getting overwritten by project specific stylesheet with the same name

## 0.15.1

  - **Released Saturday April 5th, 2014 @ 4.45pm**
  - Fixed issue in ```ajs publish```, which always published with ```--beta``` flag

## 0.15.0

  - **Released Saturday April 5th, 2014 @ 4.40pm**
  - Install globally with ```npm install -g asimov.js``` to use the new CLI
  - Scaffold a brand new project in seconds with ```ajs create [name]```
  - Start your project with ```ajs start```, which is really just an alias for ```node main.js```
  - Run all tests with ```ajs test```, or just a few matching a string with ```ajs test [grep]```
  - Create a new page with ```ajs new page [url] [template]```, for example ```ajs new page /blog/01-hello-world post```
  - Create a new template in ```/site/templates``` using ```ajs new template [name]```
  - Create a new stylesheet in ```/site/styles``` using ```ajs new style [name]```
  - Extend default classes with ```ajs extend [type] [path]```, where ```[type]``` can be Base, Middleware, Initializer, Helper or Test and ```[path]``` is relative to ```/lib```, without file extension
  - Extend your custom classes with ```ajs new [parent] [path]```, where both ```[parent]``` and ```[path]``` are paths relative to ```/lib```, without file extension
  - Publish project to NPM, create and push git tag with ```ajs publish```
  - Publish beta version with ```ajs publish --beta```, which makes the module installable with ```npm install yourModule@beta```
  - All file model paths are now consistently absolute

## 0.14.7

  - **Released Monday March 31th, 2014 @ 3.50pm**
  - Fixed issue with all page attributes gettings converted to SafeString after rendering value - SafeString will now only be used if the output value contains HTML [#174](https://github.com/adamrenklint/asimov.js/issues/174)

## 0.14.6

  - **Released Monday March 31th, 2014 @ 11.10am**
  - Fixed issue with loading path for browserify binary
  - Changed timeout for initial integration test request to 30 seconds

## 0.14.4, 0.14.5

  - **Released Sunday March 30th, 2014 @ 11.15pm**
  - Fixed critical issue with not respecting process.env.PORT
  - Added ```make publish-beta```, which makes the version installable with ```npm install asimov.js@beta``` - **use a beta version name with a fourth param**, for example ```0.12.4.beta2```

## 0.14.3

  - **Released Sunday March 30th, 2014 @ 10.50pm**
  - Restructured dependencies, everything is available everywhere

## 0.14.2

  - **Released Sunday March 30th, 2014 @ 10.30pm**
  - Fixed dev dependencies attempting to load in production environment

## 0.14.1

  - **Released Sunday March 30th, 2014 @ 10.20pm**
  - Fixed a critical issue with loading the initial config, crashed every time when loaded as npm module

## 0.14.0

  - **Released Sunday March 30th, 2014 @ 10pm**
  - Completely new and much simpler test runner format, without the awkward dependency loader [#169](https://github.com/adamrenklint/asimov.js/issues/169)
  - Use ```make test``` for the dot reporter, ```make test-verbose``` for the spec reporter
  - Test coverage reports with Istanbul with ```make coverage``` [#40](https://github.com/adamrenklint/asimov.js/issues/40)
  - Better initialization of integration test server, without setTimeout [#153](https://github.com/adamrenklint/asimov.js/issues/153)
  - ```.asimov-wrapper``` in ```asimov.base.styl``` is now responsive

## 0.13.5

  - **Released Saturday March 29th, 2014 @ 4.15pm**
  - Don't watch stylesheet dependency if it is located in ```node_modules```

## 0.13.4

  - **Released Saturday March 29th, 2014 @ 4.05pm**
  - Fixed order of loading stylesheets - now you can use the same name as a default framework stylesheet

## 0.13.3

  - **Released Saturday March 29th, 2014 @ 4pm**
  - Fixed order of loading templates - now you can use the same name as a default framework template

## 0.13.2

  - **Released Saturday March 29th, 2014 @ 3.55pm**
  - Removed test scripts from default error pages
  - Fixed framework script paths wrong when installed as npm module

## 0.13.1

  - **Released Saturday March 29th, 2014 @ 3.50pm**
  - Fixed framework templates and styles paths wrong when installed as npm module

## 0.13.0

  - **Released Saturday March 29th, 2014 @ 3.45pm**
  - Automatically reload browser when build folder changes [#62](https://github.com/adamrenklint/asimov.js/issues/62)
  - All client side javascript is now processed with browserify and served minified
  - Removed ```{{bundle}}``` helper, instead use ```{{script :path construct=true}}```
  - Fixed high CPU usage from watching directories [#165](https://github.com/adamrenklint/asimov.js/issues/165)
  - Simple redirects with page.attributes.alias [#45](https://github.com/adamrenklint/asimov.js/issues/45)
  - Better error message when trying to include a non-existing stylesheet [#166](https://github.com/adamrenklint/asimov.js/issues/166)
  - Handle both single and double quoted @import statements [#168](https://github.com/adamrenklint/asimov.js/issues/168)
  - Fixed menu helper not applying active class to active page [#142](https://github.com/adamrenklint/asimov.js/issues/142)
