URL ?= http://github.com/

all: publish

list:
	@echo `wt ls | grep URL | grep html2md | tr -d ' ' | cut -d ':' -f 2-`

log:
	wt create html2md.js
	wt logs

publish:
	wt create html2md.js

readme:
	/usr/local/bin/pandoc README.md -o README.html

run:
	curl "`wt ls | grep URL | grep html2md | tr -d ' ' | cut -d ':' -f 2-`?url=$(URL)"
