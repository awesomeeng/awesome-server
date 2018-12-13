# AwesomeServer Release Notes

#### **Version 1.2.0**

 - Turn off logging by default.

 - Adds logging to the examples.

 - Changed to use the better parsers for contentType and contentEncoding in AwesomeUtils.

 - Fix bug with Wildcard matcher.

 - Fixed error with reading json content from request when content was an empty string.

 - Adds a wildcard matcher for matching any path.

 - Add ability to turn of info log messages.

 - Adds ability to pass arguments into controller constructors when routing via filename or directory.

 - Reject with Error, not string.

 - Allow writeError() to not have content.

 - Makes sure HTTP/2 connections close on stop.

 - Fixes a bug where hostname/port could throw an exception.

#### **Version 1.1.0**

- Removes default ports for HTTP, HTTPS and HTTP/2 servers.  Ports now default to 0, which means a random port is assigned if one is not provided.
- All references to "127.0.0.1" changed to "localhost".
- No longer does a Log.Access() for each request. This functionality is expected to be implemented by the user if needed.
- When closing HTTP/2 servers, now ensures all HTTP/2 connections that are currently open are closed.

#### **Version 1.0.0**

 - Initial release.
