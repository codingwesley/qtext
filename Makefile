export PATH := $(pwd)/node_modules/.bin:$(PATH)

.PHONY: watchTsc server

watchTsc:
	node /Volumes/qw/githubsource/rc-tools/bin/rc-tools.js run watch-tsc

server:
	node /Volumes/qw/githubsource/rc-tools/bin/rc-tools.js run server