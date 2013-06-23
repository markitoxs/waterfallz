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





function fetch_tweets(socket){

	var twit = new twitter({
		consumer_key: 'dppTDWuwj8ZIQluh4HIQ',
		consumer_secret: 'Vds1HvRCDitDhzG2EOYWKMhwt80ItIGrCGttYnWfwBw',
		access_token_key: '237047644-qKdti7ZbNN9qa6UAzaQPw4fyMHQcLezsb9kPd0w5',
		access_token_secret: 'nnJ4Glc8i8MYEzDS4ptHoJTXgeMtaTuDc6P4uXL3g'
	});

	console.log("Request for tweets. ");
  twit.stream('statuses/sample', function(stream) {
		stream.on('data', function (data) {
			//conn.write(data.text);
			socket.emit('new_tweet',data.text);
      //setTimeout(kill_stream(), 150000);
    });
  });
}
 
function kill_stream() {
	stream.destroy;
	console.log('Closing stream');
}

