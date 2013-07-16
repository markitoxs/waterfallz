(function() {

  var buffer = new Array();

  var app = require('express')()
    , server = require('http').createServer(app)
    , io = require('socket.io').listen(server);
  var stream;
	var clients = 0;
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
    if ( clients == 0 ) {
			fetch_tweets(io);
			clients = clients + 1 ;
			console.log("First client connected");
    }
		else {
			clients = clients +1;
			console.log ("Another client connected");
			console.log ("Total clients: "+clients);
		}
   
		//On disconnect
		socket.on('disconnect', function () {
			clients = clients -1 ;
			console.log ("Client disconnected");
			console.log ("Total clients: "+clients);
			if ( clients == 0 ) {
				console.log ("No more clients, killing the stream");
				stream.destroy();
			}
    });

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
    //twit.stream('statuses/filter', { 'locations':'-122.75,36.8,-121.75,37.8'}, function(s) {
    //twit.stream('statuses/filter', { 'locations':'55.90,-3.35,55.99,-3.00'}, function(s) {
    twit.stream('statuses/filter', { 'locations':'-180,-90,180,90'}, function(s) {
      stream = s;
      stream.on('data', function (data) {
        // Check if data.user is not undefined
        if ( data.coordinates != null ) {
          buffer.push(data.coordinates.coordinates);
          console.log(data.coordinates.coordinates);
        //console.log(buffer.length);
        }
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
