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


app.get('/client.js', function (req, res) {
  res.sendfile(__dirname + '/client.js');
});

io.sockets.on('connection', function (socket) {
  tools.fetch_tweets(socket);

  //socket.emit('new_tweet', "aeiou");
  socket.on('reply', function (data) {
    console.log("Attempting to kill the stream"+data);
    kill_stream();
  });
});


 
function kill_stream() {
console.log("Tried to close stream");
}

