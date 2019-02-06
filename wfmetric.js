var http = require('http');

var wfmetric = {
    
    host: undefined,
    port: 3878,
    source: undefined,

    post: function(name, value, tags, date) {
        return new Promise(function(resolve, reject) {
            //check to see if host/port/source are setup.
            if(!wfmetric.host || !wfmetric.port || !wfmetric.source)
                reject("must have host, port and source setup");
            
            var metric = {
            };
            if(tags) {
              metric[name] = {
                  value: value,
                  tags: tags
              };
            } else {
              metric[name] = value;
            }

            var post_data = JSON.stringify(metric);
            
            var path = '/?h=' + wfmetric.source;
            if(date)
                path += '&d=' + date.getTime();
            else
                path += '&d=now';
            
            //console.log(metric, path);
            
            // An object of options to indicate where to post to
            var post_options = {
                host: wfmetric.host,
                port: wfmetric.port,
                path: path,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(post_data)
                }
            };

            // Set up the request
            var post_req = http.request(post_options, function(res) {
                res.setEncoding('latin1');
                res.on('data', function (chunk) {
                    //console.log('Response: ' + chunk);
                });
                res.on('end', function() {
                    resolve(metric);
                });
            });
            
            post_req.on('error', function(e) {
                reject(e);
            });

            // post the data
            post_req.write(post_data);
            post_req.end();
        });
    }
};

module.exports = wfmetric;