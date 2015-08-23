# Versioning

By default, all requests receive the latest version of the API. We encourage you to explicitly request a version by date via the Accept header. When requesting a resource via a date, you are able to get the latest version, as of the time that you are developing. Future changes to the API will be ignored by your client, unless you change the date.

> # Accept Header with Version and Content-Type Declaration

```
Accept: application/vnd.acatar.20150820+json
```

> # Example Request

```bash
curl "https://learn-api.acatar.com/users/abcd123" -I \
    -H "Accept: application/vnd.acatar.20150820+json"
```

> ## When the `-I` flag is used with `curl`, only the document info is displayed (HEAD).
> ## When the `-H` flag is used with `curl`, you can add a custom header to pass to the server.
> &nbsp;

You can check the current version through every response’s headers. Look for the `X-Acatar-Media-Type` header:

> # Example Response Header

```http
X-Acatar-Media-Type: acatar.learn-api.20150807; format=json
```

#### Important: The default version of the API may change in the future. If you're building an application and care about the stability of the API, be sure to request a specific version in the <code>Accept</code> header as shown in the examples.
