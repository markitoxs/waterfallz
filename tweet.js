var http = require('http');
var sockjs = require('sockjs');
var node_static = require('node-static');
var twitter = require('ntwitter');

var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

var tools = require('./credentials');

server.listen(9999);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});


app.get('/functions.js', function (req, res) {
  res.sendfile(__dirname + '/functions.js');
});

io.sockets.on('connection', function (socket) {
  tools.fetch_tweets(socket);
	//socket.emit('new_tweet', "aeiou");
  socket.on('reply', function (data) {
    console.log("Reply received:" + data);
  });
});

 
function kill_stream() {
	stream.destroy;
	console.log('Closing stream');
}

