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

  app.get('/paper.js', function (req, res) {
    res.sendfile(__dirname + '/paper.js');
  });

  app.get('/us-states.json', function (req, res) {
    res.sendfile(__dirname + '/us-states.json');
  });

  app.get('/project', function (req, res) {
    res.sendfile(__dirname + '/project.html');
  });

  app.get('/d3.v3.js', function (req, res) {
    res.sendfile(__dirname + '/d3.v3.js');
  });

  app.get('/cali.json', function (req, res){
    res.sendfile(__dirname + '/cali.json');
  });
 
  app.get('/world-110m.json', function (req, res){
    res.sendfile(__dirname + '/world-110m.json');
  }); 

  app.get('/world-110m2.json', function (req, res){
    res.sendfile(__dirname + '/world-110m2.json');
  }); 

  app.get('/paper', function (req, res) {
    res.sendfile(__dirname + '/paper.html');
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

    //Filter by region 
    // Edinburgh
    // twit.stream('statuses/filter', { 'locations':'-3.414001,55.882629,-3.017120,56.002605'}, function(s) {
   
    // Santa Cruz
    //twit.stream('statuses/filter', { 'locations':'-122.07,36.9420,-121.91,37.05'}, function(s) {
    //Santa Cruz geobox  -122.07,36.9420,-121.91,37.05 
    // The whole world
    twit.stream('statuses/filter', { 'locations':'-180,-90,180,90'}, function(s) {
    //California
    //twit.stream('statuses/filter', { 'locations':'-124.148941,30.902225,-115.62355,41.95132'}, function(s) {
      stream = s;
      stream.on('data', function (data) {
        // Check if data.user is not undefined
        if ( data.coordinates != null ) {
          buffer.push(data.coordinates.coordinates);
          if ( !data.coordinates.coordinates[0] == 0  && !data.coordinates.coordinates[1] == 0) { 
            
          //console.log(data.coordinates.coordinates[0]);
					io.sockets.emit('new_data', data.coordinates.coordinates); }
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
