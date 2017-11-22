

# 发布npm包
npmpublish:
	sh publish.sh
	npm version patch
	npm publish
	git push origin master

watchTsc:
	node /Volumes/qw/githubsource/rc-tools/bin/rc-tools.js run watch-tsc

server:
	node /Volumes/qw/githubsource/rc-tools/bin/rc-tools.js run server