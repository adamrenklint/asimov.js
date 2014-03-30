install:
	@echo "\n[make] Installing project dependencies...\n"
	@npm install --quiet

start:
	@node main.js

debug:
	@echo "\n[make] Starting project in debug mode...\n"
	@VERBOSE=true node main.js

open:
	@node main.js --open

test:
	@echo "\n[make] Running all tests...\n"
	@mocha tests/*/**.test.js -R spec

coverage:
	@make generate-coverage && make view-coverage || make view-coverage

generate-coverage:
	@echo "\n[make] Generating coverage report using Istanbul...\n"
	@istanbul cover _mocha -- tests/*/**.test.js -R spec

view-coverage:
	@open coverage/lcov-report/index.html

publish:
	@echo "\n[make] Publishing version $(shell node -e "var config = require('./package.json'); console.log(config.version);") to npm...\n"
	@make test && make force-publish

force-publish:
	@npm publish --dd
	@git tag "v$(shell node -e "var config = require('./package.json'); console.log(config.version);")"
	@git push --tags

.PHONY: install start test coverage generate-coverage view-coverage test-watch publish force-publish