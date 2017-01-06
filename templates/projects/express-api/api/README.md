# Introduction

This API is a REST API. It is built on HTTP standards, with intuitive URIs, leveraging HTTP response codes and HTTP verbs that can be consumed by off-the-shelf HTTP clients. It uses cross-origin resource sharing (CORS) to support secure interactions between your client and our resources. All responses are in JSON format, including payloads associated with errors.

> # API Endpoint

```no-highlight
https://api.example.com
```

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

# HTTP Status Codes

This API uses these HTTP Status codes

Error Code | Meaning
---------- | -------
200 | Success -- rejoice
201 | Created -- a new resource was created successfully
202 | Accepted -- The request was accepted and queued, actual success will be delivered via notifications
400 | Bad Request -- Umm. I don't know. Who am I?
401 | Unauthorized -- Did you authenticate first? Do you have a JWT token in your headers?
403 | Forbidden -- You are not authorized to access the resource you requested
404 | Not Found -- The endpoint could not be found
405 | Method Not Allowed -- The method/verb you requested is not supported
406 | Not Acceptable -- You requested a format that isn't JSON
410 | Gone -- The resource was removed from our servers
418 | I'm a teapot
429 | Too Many Requests -- You're requesting too many resources! Slow down!
500 | Internal Server Error -- We had a problem with our server. Try again later.
503 | Service Unavailable -- We're temporarily offline for maintenance. Please try again later.
