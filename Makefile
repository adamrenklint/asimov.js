install:
	@echo "\n[make] Installing project dependencies...\n"
	@npm install --quiet
	@echo "\n[make] Installing test dependencies...\n"
	@npm install --quiet -g nodemon mocha

start:
	@node main.js

debug:
	@echo "\n[make] Starting project in debug mode...\n"
	@VERBOSE=true node main.js

open:
	@node main.js --open

test:
	@echo "\n[make] Running all tests...\n"
	@node main.js --test

coverage:
	@make generate-coverage && make view-coverage || make view-coverage

generate-coverage:
	@echo "\n[make] Generating coverage report using Istanbul...\n"
	@istanbul cover _mocha -- tests/*/**.test.js -R spec

view-coverage:
	@open coverage/lcov-report/index.html

test-watch:
	@echo "\n[make] Running all tests and watching for changes...\n"
	@nodemon main.js --test

publish:
	@echo "\n[make] Publishing version $(shell node -e "var config = require('./package.json'); console.log(config.version);") to npm...\n"
	@make test && make force-publish

force-publish:
	@npm publish --dd
	@git tag "v$(shell node -e "var config = require('./package.json'); console.log(config.version);")"
	@git push --tags

.PHONY: install start test coverage generate-coverage view-coverage test-watch publish force-publish