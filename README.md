# FERMI

#####Server-to-Client remote method invocation (RMI) Framework.


Fermi is a Server-to-Client remote method invocation (RMI) framework. (The name “Fermi” loosely stands for _Flip Ended Remote Method Invocation._) It enables remote invocation of client-side JavaScript code from server-side Java. It is not a Java wrapper around server-side JavaScript: the Java code runs under a Web Servlet container such as Tomcat, and the JavaScript runs in a Web browser, such as Firefox.

There are two primary motivations behind this “flip-ended” RMI. One is to enable an elegant way to push data to the browser via calling a remote fnction insead of sending a message. But perpahs even more importantly, it enables the server side Java to directly consume JavaScript APIs from third parties, such as the Google Maps or Google Charts APIs.

The Fermi framework is build on top of WebSockets API, which provides the low-level full-duplex message transport between the remote JavaScript client and the Java server. Just like the WebSockets, it has a Java API and a JavaScript API. But unlike the WebSockets, it exposes a higher-level abstraction whereby the Java domain can directly call JavaScript functions in the remote browser, pass arguments to them, and receive results of their computation.

##### Example
Below is the minimal code that will get things off the ground.

Server:
<pre>
FermiEndpoint ep = FermiContainer.getInstance().newEndpoint("/example");
FermiSession session = ep.getSessionBlocking(request.getSession());
session.invoke(new Method("myJsFunction"));
</pre>

Client:
<pre>
var session = new fermi.Session(‘/example’); 
function myJsFunction() {
	// do something
}
</pre>

The code above hardly needs explaining. In the Server section, we create a FermiEndpoint, i.e. the communication mechanism between remote browsers and this server. On the second line we acquire the connection to the particular browser, represented by its HTTP Session. And, finally, we invoke a JavaScript method called myJavaScriptFunction.

For this to work, on the JavaScript side of this connection, the client must create the client’s side of the session by instantiating the fermi.Session object, and define the function myJavaScriptFunction.
In actuality, things can get much more complex. 

The Fermi framework supports 
* Both asynchronous and blocking session acquisition.
* Remote method parameters.
* Asynchronous and blocking method invocation.
* Result object inspection unmashalling.
* Support for (un-)marshalling of many basic data types.
* All asynchronous operations are exposed via the java.util.concurrent.Future mechanism.
