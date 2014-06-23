deploy:
	git checkout master && \
	cd ./dist && \
	git init . && \
	git add . && \
	git commit -m "Deploy $(REF)"; \
	git push "git@github.com:qup/zap.git" master:gh-pages --force && \
	rm -rf .git
