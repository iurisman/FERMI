## On March 23 2014 this project has been moved to its permanent home at [fermiframework.org](http://fermiframework.org)

# FERMI

#####Server-client remote JavaScript method invocation (RMI) Framework.

FERMI is a server–client remote method invocation (RMI) framework. It enables remote invocation
of client-side JavaScript functions from the user code running on a Web server. The name “FERMI” 
loosely stands for _Flip Ended Remote Method Invocation._ 

At this time, only Java is supported on the server side, although there is no reason why FERMI 
could not be extended to include support for any modern server-side language, e.g. Ruby or PHP,
so long as it supports Websockets.

FERMI is not a wrapper around server-side JavaScript, such as Rhino. The server code runs under a Web
server, e.g. the Tomcat container, and the JavaScript runs in a Web browser, such as Firefox.

There are two primary motivations for FERMI: 

* Provide a high-level linguistic construct to push data to client browser via calling a remote JavaScript function.
* Enables the server side code to consume third party JavaScript APIs such as Google Maps.

The FERMI framework is build on top of the WebSockets, which provide a low-level full-duplex message transport 
between HTTP server and client. Just like the WebSocket API, the FERMI API has two sides: the Java API and the 
JavaScript API. But unlike the WebSocket API, the FERMI API exposes a higher-level abstraction that enables the
Java domain to remotely invoke JavaScript functions in the remote browser, pass arguments to them, and receive 
results of their computation.

#####Example
Below is the minimal code that will get things off the ground.

######Server:
    FermiEndpoint ep = FermiContainer.getInstance().newEndpoint("/example");
    FermiSession session = ep.getSessionBlocking(request.getSession());
    session.invoke(new Method("myJsFunction"));


<br>
######Client:
    var session = new fermi.Session(‘/example’); 
    function myJsFunction() {
        // do something
    }

<br>
This code needs little explanation. In the Server section, we start by creating a FermiEndpoint, 
i.e. the communication mechanism between the server and remote browsers. On the second line, we acquire 
the connection to a particular browser, represented by its HTTP Session. And, finally, we invoke a 
JavaScript method called myJavaScriptFunction to be executed by the client.

For this to work, on the JavaScript side of this connection, all the client has to do is create the 
FERMI session, by instantiating the fermi.Session object, and define the function myJavaScriptFunction.

More generally, the Fermi framework supports:

* Both asynchronous and blocking session acquisition.
* Remote method parameters.
* Asynchronous and blocking method invocation.
* Result object inspection unmashalling.
* Support for (un-)marshalling of many basic data types.
* All asynchronous operations are exposed via the java.util.concurrent.Future mechanism.
