NPM_BIN = ./node_modules/.bin
ENB = $(NPM_BIN)/enb
JSHINT = $(NPM_BIN)/jshint
JSCS = $(NPM_BIN)/jscs
MOCHA = $(NPM_BIN)/mocha

.PHONY: validate
validate: lint test

.PHONY: lint
lint: npm_deps
	$(JSHINT) .
	$(JSCS) .

.PHONY: test
test: npm_deps clean build
	$(MOCHA) --recursive test/smoke

.PHONY: build
build: npm_deps
	cd test/fixtures && ../../$(ENB) make --no-cache

.PHONY: clean
clean: npm_deps
	cd test/fixtures && ../../$(ENB) make clean

.PHONY: npm_deps
npm_deps:
	npm install
