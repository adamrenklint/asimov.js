build:
	# Building
	@grunt build

lint:
	# Linting
	@grunt lint

specs:
	@kaapi

watch:
	@kaapi --watch

coverage:
	@mkdir -p coverage
	@kaapi --coverage

site: clean build coverage
	@git clone .git build
	@cd build && git checkout gh-pages && cd ..

	# Copying distibutable JS
	@cp dist/*.js build/dist/

	# Copying coverage reports
	cp -rf coverage/* build/coverage/

	# Updating gh-pages
	@cd build && git add . && git commit -am "update-$(shell date -u | tr ' ' '_')"
	@cd build && git push origin gh-pages && cd ..
	#git push origin gh-pages

clean:
	@rm -rf build coverage

.PHONY: build coverage lint
