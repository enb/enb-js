NPM_BIN = ./node_modules/.bin
JSHINT = $(NPM_BIN)/jshint
JSCS = $(NPM_BIN)/jscs

.PHONY: lint
lint:
	$(JSHINT) .
	$(JSCS) .
