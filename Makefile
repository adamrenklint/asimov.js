install:
	@npm install

start:
	@node main.js

test:
	@node main.js --test

publish:
	@make test && make force-publish

force-publish:
	@npm publish --dd
	@git tag "v$(shell node -e "var config = require('./package.json'); console.log(config.version);")"
	@git push --tags

.PHONY: install start test publish force-publish