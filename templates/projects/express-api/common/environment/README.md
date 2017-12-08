## CORS Configuration
The CORS configuration is demonstrated with annotations below.

```JavaScript
{
    "cors": {
        // When mode is set to 'off', CORS will not operate
        "mode": "off",
        // "null" allows server-to-server integration to happen
        // without CORS, including redirects (301, etc.)
        // If your app is ported to a mobile web view, you
        // may need to whitelist the "file://" origin
        "originWhiteList": ["null", "http: //localhost:3000"],
        // Set this to true if you want to allow cookies to be
        // sent to your API
        "allowCredentials": true,
        // List only the verbs that your API supports/uses
        "allowMethods": [
            "GET",
            "POST",
            "PATCH",
            "PUT",
            "DELETE",
            "OPTIONS",
            "HEAD"
        ],
        // List the headers that are accepted by your api
        // When this is null, the CORS handler will allow the
        // client to describe what headers are being sent
        "allowHeaders": [
            "Authorization",
            "Accepts",
            "Content-Type",
            "If-Match",
            "If-Modified-Since",
            "If-None-Match",
            "If-Unmodified-Since",
            "Range",
            "X-Requested-With",
            "X-Request-ID"
        ],
        // List the headers that can be exposed by the server
        "exposeHeaders": [
            "Content-Length",
            "Date",
            "ETag",
            "Expires",
            "Last-Modified",
            "X-Powered-By",
            "X-Request-ID"
        ],
        // Set the maxAge for pre-flight cache
        // (default is 2 minutes / 120 seconds)
        "cacheDuration": "120",
        // The HTTP status code and message that will be sent to
        // requests that don't meet the CORS expectations
        "denialMessage": {
            "status": 403,
            "message": "CORS Error: your origin, {origin}, is not whitelisted."
        }
    }
}
```