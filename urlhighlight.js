//      urlhighlight 0.0.1
//      (c) 2012 client IO
//      URL highlighter

(function(root, factory) {

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
        
    } else {
        // Browser globals.
        root.urlhighlight = factory();
    }

}(this, function() {

    var a =  document.createElement('a');

    // Parse url using the smart DOM technique from James Padolsey with
    // slight modifications to support Data URLs.
    function parse(url) {
         
        a.href = url;

        var parsedUrl = {

            source: url,
            protocol: a.protocol,
            host: a.hostname,
            port: a.port,
            query: a.search,
            params: (function() {
                
                var queryParams = {},
                    segments = a.search.replace(/^\?/,'').split('&'),
                    idx = segments.length;
                    
                while (idx--) {
                    if (segments[idx]) {
                        var nameValue = segments[idx].split('=');
                        queryParams[nameValue[0]] = nameValue[1];
                    }
                }
                return queryParams;
            })(),
            
            file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
            hash: a.hash.replace('#',''),
            path: a.pathname.replace(/^([^\/])/,'/$1'),
            relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],
            segments: a.pathname.replace(/^\//,'').split('/')
        };

        if (parsedUrl.protocol === 'data-uri:') {
            
            parsedUrl.mimeType = a.pathname.replace(/,.*$/, '');
            parsedUrl.encoding = a.pathname.replace(/(^.*,)(.*)(;.*$)/, '$2');
            parsedUrl.data = a.pathname.replace(/(^.*,)(.*)(;.*$)/, '$3').substring(1);
        }
        
        return parsedUrl;
    }

    // Templates for all URL components.
    
    var protocol = '<span class="url-protocol">{{protocol}}</span>';
    var mimeType = '<span class="url-mime-type">{{mimeType}}</span>';
    var mimeTypeDelimiter = '<span class="url-mime-type-delimiter">,</span>';
    var encoding = '<span class="url-encoding">{{encoding}}</span>';
    var encodingDelimiter = '<span class="url-encoding-delimiter">;</span>';
    var data = '<span class="url-data">{{data}}</span>';
    var protocolDelimiter = '<span class="url-protocol-delimiter">//</span>';
    var host = '<span class="url-host">{{host}}</span>';
    var portDelimiter = '<span class="url-port-delimiter">:</span>';
    var port = '<span class="url-port">{{port}}</span>';
    var path = '<span class="url-path">{{path}}</span>';
    var queryDelimiter = '<span class="url-query-delimiter">?</span>';
    var queryParamName = '<span class="url-query-param-name">{{name}}</span>';
    var queryParamAssign = '<span class="url-query-param-assign">=</span>';
    var queryParamValue = '<span class="url-query-param-value">{{value}}</span>';
    var queryParamDelimiter = '<span class="url-query-param-delimiter">&amp;</span>';
    var hashDelimiter = '<span class="url-hash-delimiter">#</span>';
    var hash = '<span class="url-hash">{{hash}}</span>';

    // Fill the `template` with `value`.
    
    function fill(template, value) {
        return template.replace(/{{.*}}/, value);
    }

    // Public API consists of one function that takes an options object as
    // an argument and returns an HTML string.
    // The most important property is the `url` which contains
    // the actual url as string.
    // `opt` may contain templates for all the parts of the URL if the default templates
    // are not sufficient. Note that the output does not have to be HTML necessarily.
    // With custom templates, one can use `urlhighlight()` to output e.g. Markdown.

    // Example:

    //     urlhighlight({ url: 'http://www.example.com?foo=bar' })
    //     urlhighlight({ url: 'http://www.example.com?foo=bar', protocol: '<div class="myprotocol">{{protocol}}</div>' })
    
    return function(opt) {

        var url = parse(opt.url);

        // Special case for data-uri.
        
        if (url.data) {
            
            return [
                fill(opt.protocol || protocol, url.protocol),
                fill(opt.mimeType || mimeType, url.mimeType),
                fill(opt.urlmimeTypeDelimiter || mimeTypeDelimiter),
                fill(opt.encoding || encoding, url.encoding),
                fill(opt.encodingDelimiter || encodingDelimiter),
                fill(opt.data || data, url.data)
            ].join('');
        }


        var queryParams = [];
        for (var paramName in url.params) {

            queryParams.push([
                fill(opt.queryParamName || queryParamName, paramName),
                fill(opt.queryParamAssign || queryParamAssign),
                fill(opt.queryParamValue || queryParamValue, url.params[paramName])
            ].join(''));
        }

        return [
            
            fill(opt.protocol || protocol, url.protocol),
            fill(opt.protocolDelimiter || protocolDelimiter),
            fill(opt.host || host, url.host),
            url.port ? fill(opt.portDelimiter || portDelimiter) : '',
            fill(opt.port || port, url.port),
            url.path !== '/' ? fill(opt.path || path, url.path) : '',
            queryParams.length ? fill(opt.queryDelimiter || queryDelimiter) : '',
            queryParams.join(fill(opt.queryParamDelimiter || queryParamDelimiter)),
            url.hash ? fill(opt.hashDelimiter || hashDelimiter) : '',
            url.hash ? fill(opt.hash || hash, url.hash) : ''
            
        ].join('');
    };
     
}));
