(function() {

  var app = require('express')()
    , server = require('http').createServer(app)
    , io = require('socket.io').listen(server);
  var stream;

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
      console.log("Evaluating:"+data);
      if ( data == 1000){
        kill_stream();
      }
    });
  });


   
  function kill_stream() {
  console.log("Trying to close stream");
  stream.destroy();
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
    twit.stream('statuses/sample', function(s) {
      stream = s;
      stream.on('data', function (data) {
        //conn.write(data.text);
  			//io.sockets.emit('new_tweet',stringToColour(data.text));
        console.log("NEW DATA");
        io.sockets.emit('new_data',data.user.profile_image_url);
      }); 
    }); 
  }


  var stringToColour = function(str) {
    if (str){
      // str to hash
      for (var i = 0, hash = 0; i < str.length; hash = str.charCodeAt(i++) + ((hash << 5) - hash));

      // int/hash to hex
      for (var i = 0, colour = "#"; i < 3; colour += ("00" + ((hash >> i++ * 8) & 0xFF).toString(16)).slice(-2));
    }
    else {
      colour="#00FF00"
    }
    return colour;
  }
  
})();
