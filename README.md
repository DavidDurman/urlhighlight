urlhighlight
============

urlhighlight is licensed under the MIT license.

urlhighlight is a tiny (888B minified and gzipped) JavaScript library for syntax highlighting URLs.
Its function is very apparent from its usage:

    urlhighlight({ url: 'http://www.example.com/section/article?id=123#top' })

    // <span class="url-protocol">http:</span>
    // <span class="url-protocol-delimiter">//</span>
    // <span class="url-host">www.example.com</span>
    // <span class="url-path">/section/article</span>
    // <span class="url-query-delimiter">?</span>
    // <span class="url-query-param-name">id</span>
    // <span class="url-query-param-assign">=</span>
    // <span class="url-query-param-value">123</span>
    // <span class="url-hash-delimiter">#</span>
    // <span class="url-hash">top</span>


Features:

- lightweight (888B minified and gzipped)
- syntax highlights URLs
- custom templates
- support for data-uri
- support for AMD (asynchronous module definition)
- free
