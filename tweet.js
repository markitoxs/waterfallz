var twitter = require('ntwitter');

var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

//Remove debug messages 
io.set('log level',1);

server.listen(9999);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});


app.get('/client.js', function (req, res) {
  res.sendfile(__dirname + '/client.js');
});

io.sockets.on('connection', function (socket) {
  fetch_tweets(io);

  //socket.emit('new_tweet', "aeiou");
  socket.on('reply', function (data) {
    console.log("Attempting to kill the stream"+data);
    kill_stream();
  });
});


 
function kill_stream() {
console.log("Tried to close stream");
}



function fetch_tweets(io) {
  var twitter = require('ntwitter');
  var config  = require('./config.json');
  var twit = new twitter({
    consumer_key: config.consumer_key,
    consumer_secret: config.consumer_secret,
    access_token_key: config.access_token_key,
    access_token_secret: config.access_token_secret
  }); 

  console.log("Request for tweets. ");
  twit.stream('statuses/sample', function(stream) {
    twit.currentStream = stream;
    stream.on('data', function (data) {
      //conn.write(data.text);
      io.sockets.emit('new_tweet',data.text);
    }); 
  }); 
}
