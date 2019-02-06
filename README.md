# wfmetric

**This package is not the official package for sending Wavefront metrics, the official Wavefront NPM package is [wavefrontmetrics](https://www.npmjs.com/package/wavefrontmetrics)**
> Library to send metrics to a wavefront proxy when using the powerful vmware wavefront monitoring and analytics tool located at <http://www.wavefront.com>.

## Including wfmetric

A pre-requisite for this package to work is to have a wavefront proxy already setup and available on the network.

```sh
npm install wfmetric --save
```

## Usage

### Import the wfmetric module

```js
var wfmetric = require('wfmetric');
```

### Set the proxy variables

```js
wfmetric.host = 'localhost'; //or a valid ip address
wfmetric.port = 3878; //optional, this will default to the jsonListenerPorts port of 3878
wfmetric.source = 'test'; //the source that will be reported for the metric.
```

### Send data to the poxy

```js
var name = 'test.metric';
var value = 1.0;
var tags = {
    version: '1.0'
};
var date = new Date();
wfmetric.post(name, value, tags, date)
    .then((result) => {
        console.log(result);
    }).catch((err) => {
        console.log(err);
    }); 
```

#### Variables

wfmetric.post method variables are defined as follows

##### :name

Name of the metric that will be sent to the proxy.  Valid names can have the period "." character to indicate hierarchy.  More information about the metric name can be found at the official Wavefront documentation [Wavefront Data Format Fields](https://docs.wavefront.com/wavefront_data_format.html#wavefront-data-format-fields).

##### :value

Value that is attached to the metric sent to the proxy, double-precision floating point number or a long integer.  More information about the value can be found at the official Wavefront documentation [Wavefront Data Format Fields](https://docs.wavefront.com/wavefront_data_format.html#wavefront-data-format-fields).

##### :tags

Point tags that are to be attached to the metric that is sent to the proxy.  More information about the point tags can be found at the official Wavefront documentation [Best Practices for Point Tags](https://docs.wavefront.com/wavefront_data_format.html#best-practices-for-point-tags).

##### :date[optional]

Optional variable with the date of the metric that is being sent to the proxy.  If no value is used the current date when the proxy receives the post will be used.

### Example of sending multiple metrics to the proxy

```js
var data = [{
    value: 99.1,
    tags: {
        os: 'windows'
    }
}, {
    value: 95.4,
    tags: {
        os: 'linux'
    }
}];

var sendData = function(data) {
    return new Promise((resolve, reject) => {
        var promises = [];
        
        var date = new Date();
        
        for(var i = 0; i < data.length; i++) {
            promises.push(wfmetric.post('xyz.zyx', data[i].value, data[i].tags, date));
        }
        Promise.all(promises)
            .then((result) => {
                resolve();
            }).catch((err) => {
                reject(err);
            });
    });
};

sendData(data)
    .then((result) => console.log("Success"))
    .catch((err) => console.log(err));
```

## Contributors

[Randall Simpson](https://www.linkedin.com/in/randall-simpson-356a9111b/)

## License

The MIT License (MIT) Copyright (c) 2018 Randall Simpson

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Updates

Version 1.1.0 includes a bug fix for submitting a metric without any tags.  Previous versions would apply .value to the end of the metric.