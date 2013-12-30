FERMI
=====

#####Server-to-Client remote method invocation (RMI) Framework.


Fermi is a Server-to-Client remote method invocation (RMI) framework. (The name “Fermi” loosely stands for _Flip Ended Remote Method Invocation._) It enables remote invocation of client-side JavaScript code from server-side Java. It is not a Java wrapper around server-side JavaScript: the Java code runs under a Web Servlet container such as Tomcat, and the JavaScript runs in a Web browser, such as Firefox, fig. 1.

![alt text](/path/to/img.jpg "Title")
 
Fig. 1. There are two primary motivations behind this “flip-ended” RMI. One is to enable an elegant way to push data to the browser, as the Chrome browser in the middle.  But perpahs even more importantly, it enables the server side Java to directly consume JavaScript APIs from third parties, such as the Google Maps or Google Charts APIs.

The Fermi framework is build on top of WebSockets API, which provides the low-level full-duplex message transport between the remote JavaScript client and the Java server. Just like WebSockets, it has a Java API and a JavaScript API, but unlike WebSockets, it exposes a higher-level abstraction, where the Java code can directly call JavaScript functions in the remote browser, pass arguments to them, and receive their return objects.
1.1	Example
Below is the minimal code that will get things off the ground.
Server:
FermiEndpoint ep = FermiContainer.getInstance().newEndpoint("/example");
FermiSession session = ep.getSessionBlocking(request.getSession());
session.invoke(new Method("myJsFunction"));

Client:
var session = new fermi.Session(‘/example’); 
function myJsFunction() {
	// do something
}

The code above hardly needs explaining. In the Java section, we create a FermiEndpoint, i.e. the communication mechanism between browsers and this server. On the second line we acquire the connection to the particular browser, represented by the current HTTP Session. And finally, we invoke a JavaScript method called myJavaScriptFunction.
For this to work, on the JavaScript side of this connection, the client must create the client’s side of the session by instantiating the fermi.Session object, and define the function myJavaScriptFunction.
In actuality, things can get much more complex. Fermi supports 
•	Asynchronous or blocking session acquisition.
•	Method parameters.
•	Asynchronous or blocking method invocation.
•	Return object inspection.
•	Support for marshalling and un-marshalling of simple types.
•	All asynchronous operations are exposed via the java.util.concurrent.Future mechanism.
