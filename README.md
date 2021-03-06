# html2md

*html2md* is a simple Webtask.io to convert a web page to markdown.

See https://webtask.io for information about Webtasks.

## Use
Create the webtask using the included Makefile:

```
	make publish

	# with logging

	make log

```

To run the task from the command line:

```
	make run

	# Alternate URL

	env URL=http://auth0.com make run
```

To get the URL for the webtask:

```
	make list
```

To run in a browser, get the url from `make list` and add the `url`
query parameter:

```
	https://<webtask>?url=http://github.com
```

## Notes
*html2md* only converts static elements of html. Dynamic content is
not processed.

## Known Issues
[isomorphic-fetch](https://github.com/matthew-andrews/isomorphic-fetch) `timeout`
option does not seem to work.

Even when set to 500ms, the code runs for 3000+ms. The Webtask
eventually times out *before* the fetch request times out.

## TODO
+ Unit tests
+ Process dynamic content
+ Replace Makefile with gulpfile.js
+ Find a solution to set timeouts
