

# 发布npm包
npmpublish:
	sh publish.sh
	npm version patch
	npm publish
	git push origin master