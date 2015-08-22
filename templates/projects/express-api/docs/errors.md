# Errors

This API uses these HTTP Status codes for errors

Error Code | Meaning
---------- | -------
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
503 | Service Unavailable -- We're temporarially offline for maintanance. Please try again later.
