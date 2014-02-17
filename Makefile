install:
	@npm install
	@npm install -g runner.js

start:
	@node main.js

test:
	@node bin/runner test tests

coverage:
	@node bin/runner coverage tests

publish:
	@npm publish
	@git tag "v$(shell node -e "var config = require('./package.json'); console.log(config.version);")"
	@git push --tags

.PHONY: install start test coverage publish