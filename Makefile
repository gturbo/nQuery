REPORTER = spec

all: test

test:
	@NODE_ENV=test ./node_modules/.bin/mocha --recursive --reporter $(REPORTER) --timeout 3000

jshint:
	jshint lib public/javascript test routes/index.js

tests: test

tap:
	@NODE_ENV=test ./node_modules/.bin/mocha -R tap > results.tap

unit:
	@NODE_ENV=test ./node_modules/.bin/mocha --recursive -R xunit > results.xml --timeout 3000


.PHONY: test tap unit jshint skel