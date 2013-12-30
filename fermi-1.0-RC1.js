/*
 * Copyright 2013 Sanguine Computing Inc.
 * 
 * 1. Version
 * 2. License
 * 3. Docs
 */
 
/*
 * Globals.
 */
if (!fermi) {
   var fermi = {};
}
 
/**
  * SESSION
  * 1. Open websocket connection to the provided URL.
  */
fermi.Session = function(path) {
   
   var uri = "ws://" + location.host + path;
   var thisSession = this;
   
   if ('WebSocket' in window) {
      this.ws = new WebSocket(uri);
   } else if ('MozWebSocket' in window) {
      this.ws = new MozWebSocket(uri);
   } else {
      throw "Browser does not support websockets."
   }

   /*
    */
   this.ws.onopen = function() {
      // ?
   }

   /*
    */
   this.ws.onerror = function(err) {
      throw new Error("Fermi Session Error");
   };
   
   this.ws.onclose = function(close) {
      // ?
   };

   /*
    */
   this.ws.onmessage = function(msg) {
      var message = eval('(' + msg.data + ')');
      if (message.type == "invoke") {
         try {
            var func = eval(message.method.func);
            var params = message.method.params;
            var result = new fermi.Result(message.id, this);
            params.splice(0, 0, result);

            func.apply(thisSession, params);

         }
         catch(error) {
            this.send(JSON.stringify({"type": 0, "id": message.id, "body": error.message}));
            // console.log(error.message)
            // rethrow in the browser for debugging
            throw error;
         }
      }
      else {
         sendError(this, "Unknown Message Type '" + message.type + "'");
      } 
   };
}

/**
  *
  */ 
fermi.Result = function(messageId, socket) {
   this.sent = false;
      
   /*
    * Send result back to the server.
    */
   this.send = function(result) {
      if (this.sent) throw new Error("This result object has already been sent");
      if (arguments.length == 0) {
         // No result was set; this is how we decide it's a void return type.
         socket.send(JSON.stringify({"type": 2, "id": messageId}));
      }
      else {
         // Regular result.
         socket.send(JSON.stringify({"type": 1, "id": messageId, "body": result}));
      }
      this.sent = true;
   }
   
   /*
    * Throw and exception back to the server.
    */
    this.throw = function(message) {
       socket.send(JSON.stringify({"type": 0, "id": messageId, "body": message}));
    }
}


function utf8AbFromStr(str) {
    var strUtf8 = unescape(encodeURIComponent(str));
    var ab = new Uint8Array(strUtf8.length);
    for (var i = 0; i < strUtf8.length; i++) {
        ab[i] = strUtf8.charCodeAt(i);
    }
    return ab.buffer;
}