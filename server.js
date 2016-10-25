'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const app = express();

const server = app.listen(PORT, () => {   
  console.log('\x1b[36m' + ' Axure signal' + '\x1b[0m \n ------------\n listening on http://localhost:' + PORT + '\n');
});
 
app.use(bodyParser.urlencoded({ extended: true }));
app.use( express.static('static') ); 

const io = socketIO(server);
    
io.on('connection', function(socket){
  
  socket.on('signal', function(msg){
    if (msg.signal) { 

      if (msg.message) { var message = req.body.message; }
      else { var message = null; }

      io.emit('signal', msg); 
      console.log(" signal \x1b[36m" + msg.signal + " (WEBSOCKET: " + socket.id + ")\x1b[0m"+" received with message: \x1b[36m" + message + "\x1b[0m");
    }
    else {
      console.log("\x1b[35m WEBSOCKET - Missing 'signal' parameter (json)\x1b[0m");
    }

    // socket.broadcast.emit('signal', msg);
  });


});




app.get("/", (req,res) => {

  res.header('Access-Control-Allow-Origin', '*');
  res.sendFile(path.join(__dirname + '/index.html'));
});



app.post("/", (req,res,next) => {
    res.header('Access-Control-Allow-Origin', '*');

    if (req.body.message) { var message = req.body.message; }
    else { var message = null; }

    if (req.body.signal) {
        var change = {"signal": req.body.signal, "message": message};
        io.emit('signal', change);
        console.log(" Signal \x1b[36m" + req.body.signal +" (HTTP POST)\x1b[0m received with message: \x1b[36m" + message + "\x1b[0m");
        res.json(change);
    }
    else {
      console.log("\x1b[35m HTTP POST - Missing 'signal' parameter (x-www-form-urlencoded)");
      res.status(404).json({"error":"Missing 'signal' parameter (x-www-form-urlencoded)"});
    }

});

