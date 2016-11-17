# Versioning

By default, all requests receive the latest version of the API. We encourage you to explicitly request a version by date via the Accept header. When requesting a resource via a date, you are able to get the latest version, as of the time that you are developing. Future changes to the API will be ignored by your client, unless you change the date.

> # Accept Header with Version and Content-Type Declaration

```
Accept: application/vnd.<%= projectName %>.20150820+json
```

> # Example Request

```bash
# When the `-I` flag is used with `curl`, only the document info is displayed (HEAD).
# When the `-H` flag is used with `curl`, you can add a custom header to pass to the server.
curl "http://localhost:3000/example/legos" -I \
    -H "Accept: application/vnd.<%= projectName %>.20150820+json"
```

```js
$.ajax({
    type: 'GET',
    url: '/example/legos/',
    dataType: 'json',
    crossDomain: true,
    headers: {
        "Accept": "application/vnd.<%= projectName %>.20150820+json"
    }
}).done(function (data, status, jqXhr) {
    console.log(jqXhr.getAllResponseHeaders());
});
```

You can check the current version through every response’s headers. Look for the `X-<%= projectName %>-Media-Type` header:

> # Example Response Header

```http
X-<%= projectName %>-Media-Type: <%= projectName %>.20150820; format=json
```

#### **Important**: The default version of the API may change in the future. If you're building an application and care about the stability of the API, be sure to request a specific version in the `Accept` header as shown in the examples.
