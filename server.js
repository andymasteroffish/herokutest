'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  //.listen(PORT, () => console.log(`Listening on ${ PORT }`));
  .listen(PORT, startup);

const io = socketIO(server);

var clicks = 0;	//how many clicks the server has recieved. This will reset if we restart the server

//this function fires when a new computer connects
//this is where we set up everything for the socket to that computer
io.on('connection', (socket) => {
  console.log('Client connected');
  
  io.emit('tellClicks', {num: clicks});	//give it the value when it starts

  socket.on('disconnect', disconnect);
  
  socket.on("click", function(){
  	clicks++;
  	console.log("clicky "+clicks+" from "+socket.id);
  	io.emit('tellClicks', {num: clicks});		//this is wrapping the value in an object. Useful if we want to send more than one value
  });
});


//spit out the time once every 1000 milis
setInterval(() => io.emit('time', new Date().toTimeString()), 1000);


function startup(){
	console.log("server started");
	console.log(`Listening on ${ PORT }`);
}

function disconnect(){
	console.log('Client disconnected')
}


