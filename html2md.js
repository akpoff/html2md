/*
 * Copyright (c) 2017 Aaron Poffenberger <akp@hypernote.com>
 *
 * Permission to use, copy, modify, and distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

/*
 * html2md.js
 *
 * A simple Webtask.io to convert a web page to markdown.
 *
 * Notes: Only converts static elements of html.
 *        Dynamic content is not processed.
 *
 */

var fetch = require('isomorphic-fetch');
var sprintf = require('sprintf-js').sprintf;
var upndown = require('upndown');

function html2md(source, res, html) {
    // Works great for static code.
    // Need a solution for dynamic pages
    var und = new upndown()
    und.convert(html, function(err, markdown) {
	if (err) {
	    res.writeHead(500, { 'Content-Type': 'text/plain '});
	    res.end(
		sprintf('<h1>Error %d</h1> Error converting %s\n',
			500,
			source));
	} else {
	    res.writeHead(200, { 'Content-Type': 'text/plain '});
	    res.end(markdown + '\n');
	}
    });
}

module.exports = function(ctx, req, res) {
    var query = ctx.query;
    var qry_url = query.url;
    var qry_html = query.html;

    if (qry_url) {
	// Can't catch timeout errors
	// fetch does not have a timeout option, blech!
	fetch(qry_url)
	    .then(function(response) {
		if (response.status >= 400) {
		    res.writeHead(response.status,
				  { 'Content-Type': 'text/html'});
		    res.end(
			sprintf('<h1>Error %d</h1> Unable to GET %s\n',
				response.status,
				qry_url));
		} else {
		    return response.text();
		}
	    })
	    .then(function(html) {
		if (html) {
		    html2md(qry_url, res, html);
		} else if (html.trim = '') {
		    res.writeHead(400, { 'Content-Type': 'text/html '});
		    res.end(
			sprintf('<h1>Error %d</h1> No content at %s\n',
				400,
				qry_url));
		} else {
		    res.writeHead(400, { 'Content-Type': 'text/html '});
		    res.end(
			sprintf('<h1>Error %d</h1> Unknown error\n',
				400,
				qry_url));
		}
	    })
    } else if (qry_html) {
	html2md('raw html', res, qry_html);
    } else {
	// Remove leading forward slash
	var path = req.url.replace(/^\//g, '');
	var uri_url = sprintf('https://%s/%s?url=%s',
			      req.headers.host,
			      path,
			      'http://github.com/');
	var uri_html = sprintf('https://%s/%s?html=%s',
			       req.headers.host,
			       path,
			       encodeURI('<h1>Test html to markdown</h1>'));

	res.writeHead(200, { 'Content-Type': 'text/html '});
	res.end('<h1>Web Page to Markdown</h1> ' +
		'<p>Submit a url to convert to markdown as a url-encoded ' +
		'query parmeter</p>' +
		sprintf('<p><quote><a href="%1$s">%1$s</a></quote></p>\n', uri_url) +
		sprintf('<p><quote><a href="%1$s">%1$s</a></quote></p>\n', uri_html)
	       );
    }
}
