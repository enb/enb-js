NPM_BIN = ./node_modules/.bin
ENB = $(NPM_BIN)/enb
JSHINT = $(NPM_BIN)/jshint
JSCS = $(NPM_BIN)/jscs
MOCHA = $(NPM_BIN)/mocha

.PHONY: validate
validate: lint test

.PHONY: lint
lint:
	$(JSHINT) .
	$(JSCS) .

.PHONY: test
test: clean build
	$(MOCHA) --recursive test/smoke

.PHONY: build
build:
	cd test/fixtures && ../../$(ENB) make --no-cache

.PHONY: clean
clean:
	cd test/fixtures && ../../$(ENB) make clean