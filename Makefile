

# 发布npm包
npmpublish:
	npm version patch
	npm publish
	git push origin master