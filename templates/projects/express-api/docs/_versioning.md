# Versioning

By default, all requests receive the latest version of the API. We encourage you to explicitly request a version by date via the Accept header. When requesting a resource via a date, you are able to get the latest version, as of the time that you are developing. Future changes to the API will be ignored by your client, unless you change the date.

> # Accept Header with Version and Content-Type Declaration

```
Accept: application/vnd..20150820+json
```

> # Example Request

```bash
curl "https://api.example.com/users/abcd123" -I \
    -H "Accept: application/vnd.example.20150820+json"
```

```js
var https = require('https'),
    options;

options = {
    host: 'api.example.com',
    port: 443,
    path: '/users/abcd123',
    method: 'GET',
    headers: {
        Accept: 'application/vnd.example.20150820+json'
    }
};

http.request(options, function(res) {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));

    res.setEncoding('utf8');
    res.on('data', function (chunk) {
        console.log('BODY: ' + chunk);
    });
}).end();
```

> ## When the `-I` flag is used with `curl`, only the document info is displayed (HEAD).
> ## When the `-H` flag is used with `curl`, you can add a custom header to pass to the server.
> &nbsp;

You can check the current version through every response’s headers. Look for the `X-Example-Media-Type` header:

> # Example Response Header

```http
X-Example-Media-Type: example.20150807; format=json
```

#### **Important**: The default version of the API may change in the future. If you're building an application and care about the stability of the API, be sure to request a specific version in the `Accept` header as shown in the examples.
