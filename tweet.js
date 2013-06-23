var twitter = require('ntwitter');

var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

//Remove debug messages 
io.set('log level',1);

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
  socket.on('reply', function (stream) {
    console.log("Attempting to kill the stream");
    // kill_stream(stream);
  });
});

 
function kill_stream(stream) {
	stream.destroy(function (){console.log('Stream closed');});
}

