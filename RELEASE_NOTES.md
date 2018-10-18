# AwesomeServer Release Notes

#### **Version 1.0.0**

 - Initial release.

#### **Version 1.1.0**

 - Removes default ports for HTTP, HTTPS and HTTP/2 servers.  Ports now default to 0, which means a random port is assigned if one is not provided.
 - All references to "127.0.0.1" changed to "localhost".
 - No longer does a Log.Access() for each request. This functionality is expected to be implemented by the user if needed.
 - When closing HTTP/2 servers, now ensures all HTTP/2 connections that are currently open are closed.
