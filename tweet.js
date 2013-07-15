(function() {

  var buffer = new Array();

  var app = require('express')()
    , server = require('http').createServer(app)
    , io = require('socket.io').listen(server);
  var stream;

  //Remove debug messages 
  io.set('log level',1);

  server.listen(9999);

  //////////////////////////////////////
  // Handlers for serving static files
  //////////////////////////////////////
  
  app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
  });


  app.get('/client.js', function (req, res) {
    res.sendfile(__dirname + '/client.js');
  });

  ///////////////////////////////////////
  // What to do on different socket events
  ////////////////////////////////////////
  
  io.sockets.on('connection', function (socket) {
    //On new connection will start the stream
    fetch_tweets(io);

    //On consume will consume the array
    socket.on('consume', function () {
      //console.log("Received Request for image");
      consume_array();
    });
  });

  //////////////////////////////////////////
  // function that initializes the stream
  // and adds the value to the array
  //////////////////////////////////////////

  function fetch_tweets(io) {
    var twitter = require('ntwitter');
    var config  = require('./config.json');
    var twit = new twitter({
      consumer_key: config.consumer_key,
      consumer_secret: config.consumer_secret,
      access_token_key: config.access_token_key,
      access_token_secret: config.access_token_secret
    }); 

    console.log("Start stream of tweets.");
    twit.stream('statuses/sample', function(s) {
      stream = s;
      stream.on('data', function (data) {
        // Check if data.user is not undefined
        if ( data.user ) {
          buffer.push(data.user.profile_image_url);
        }
        //console.log(buffer.length);
      }); 
    }); 
  }

  ////////////////////////////////////////////
  // Function that will grab an emit top
  // value from the array
  ////////////////////////////////////////////
  
  function consume_array() {
    if ( buffer[0] != null ){
      io.sockets.emit('new_data',buffer[0]);
      buffer.shift();
    }
  }
  
})();
