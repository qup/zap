deploy:
	git checkout master && \
	cd ./dist && \
	git checkout -b gh-pages
	git init . && \
	git add . && \
	git commit -m "Deploy $(REF)"; \
	git push "https://github.com:qup/zap.git" master:gh-pages && \
	rm -rf .git
