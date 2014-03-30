# Changelog

## 0.14.4, 0.14.5

  - **Released Sunday March 30th, 2014 @ 11.15pm**
  - Fixed critical issue with not respecting process.env.PORT
  - Added ```make publish-beta```, which makes the version installable with ```npm install asimov.js@beta``` - **use a beta version name with a fourth param**, for example ```0.12.4.beta2```

## 0.14.3

  - **Released Sunday March 30th, 2014 @ 10.50pm**
  - Restructure dependencies, everything is available everywhere

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
