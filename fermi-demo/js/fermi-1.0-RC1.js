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

   //this.ws.binaryType = "arraybuffer";
   /*
    */
   this.ws.onopen = function() {
      console.log("Fermi Session opened");    
   };

   /*
    */
   this.ws.onerror = function(err) {
      console.log("ONERROR");
      console.dir(err);
      throw new Error("Fermi Session Error" + err);
   };
   
   this.ws.onclose = function(close) {
      console.log("ONCLOSE"); 
      console.dir(close);     
   };

   /*
    */
   this.ws.onmessage = function(msg) {
      var message = eval('(' + msg.data + ')');
      if (message.type == "invoke") {
         try {
            var func = eval(message.method.func);
            var params = message.method.params;
            params.splice(0, 0, new fermi.Response(message.id, this));

            func.apply(thisSession, params);
            //sendResponse(this, message.id, result);
         }
         catch(error) {
            sendError(this, message.id, error.message);
            // rethrow in the browser for debugging
            console.log(error.message)
            throw error;
         }
      }
      else {
         sendError(this, "Unknown Message Type '" + message.type + "'");
      } 
   };
      
   var sendError = function(socket, id, errorMessage) {
      send(socket, JSON.stringify({"type": 0, "id": id, "body": errorMessage}));
   }
   
   var sendResponse = function(socket, id, result) {
      send(socket, JSON.stringify({"type": 1, "id": id, "body": result}));
   }
   
   var send = function(socket, msg) {
      socket.send(msg);      
   }
}

/**
  *
  */ 
fermi.Response = function(messageId, socket) {
   this.response = [];
   this.id = messageId;
   this.ws = socket;
}

/**
  * Set an object as the entire response.
  * Replaces any existing content.
  */
fermi.Response.prototype.set = function(obj) {
   this.response = obj;
   return this;
}

/**
  * Add to the end of the response array.
  */
fermi.Response.prototype.add = function(obj) {
   this.response.push(obj);
   return this;
}

/**
  * Send response back to the server.
  */
fermi.Response.prototype.send = function() {
   var payload = JSON.stringify({"type": 1, "id": this.id, "body": this.response});
   this.ws.send(payload);
}

function utf8AbFromStr(str) {
    var strUtf8 = unescape(encodeURIComponent(str));
    var ab = new Uint8Array(strUtf8.length);
    for (var i = 0; i < strUtf8.length; i++) {
        ab[i] = strUtf8.charCodeAt(i);
    }
    return ab.buffer;
}