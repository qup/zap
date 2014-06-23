deploy:
	git checkout master && \
	cd ./dist && \
	git init . && \
	git add . && \
	git push origin gh-pages && \
	git commit -m "Deploy $(REF)"; \
	git push "https://github.com/qup/zap.git" master:gh-pages && \
	rm -rf .git
