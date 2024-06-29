# AwesomeServer Release Notes


#### **Version 1.6.5**

 - Adds typescript types.

#### **Version 1.6.4**

 - Adds typescript types.

#### **Version 1.6.3**

 - Adds typescript types.

#### **Version 1.6.2**

 - Fixes minor error in directory resolution error reporting.

#### **Version 1.6.1**

 - Adds support for typescript files (.ts) when routing to directories. This allows tools like ts-node to work with AwesomeServer.

#### **Version 1.6.0**

 - Adds Positional Parameter matcher for handling paths with positional parameters. Please see [The Documentation](https://github.com/awesomeeng/awesome-server/blob/master/docs/Paths.md#positional-parameter-paths) for more details.
 - Dependencies updated.

#### **Version 1.5.0**

 - Dependencies updated.
 - Documentation updates.
 - adds response.setHeader.
 - Add more log messages around push/redirect/serve.
 - Directories will now route filenames and filenames.startsWith.

#### **Version 1.4.0**

 - Moves MimeTypes out to AwesomeUtils.

 - Adds HEAD response for directory paths.

 - Made directory serve serve index.html if path is directory and both exist.

 - Changed HTTPRequest.path to return the path, not the request url, which may contain the query string.

#### **Version 1.3.1**

 - Updating external dependency versions.

#### **Version 1.3.0**

 - Add missing license file.

 - Change serve for directories to cleanup wildcard additions.

 - Adds HEAD calls for DirectoryServe and FileServe controllers.

 - Fix serve() to better handle root paths.

 - Fixes bug with DirectoryServerController and files that dont exist.

 - Documentation: Fix minor typo.

#### **Version 1.2.1**

 - Remove external dev dependency on request and request-promise-native.

 - Performance tuning and improvements.

 - Allow empty length strings in response.write*() functions.

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
