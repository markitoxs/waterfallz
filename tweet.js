(function () {

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


  app.get('/jquery.tipsy.js', function (req, res) {
    res.sendfile(__dirname + '/jquery.tipsy.js');
  });

  app.get('/tipsy.css', function (req, res) {
    res.sendfile(__dirname + '/tipsy.css');
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

    //On change_region, will make a new request
    socket.on('change_region', function (newRegion) {
      //First thing to do is to destroy the stream.
      console.log("Change of region to"+newRegion+" requested");
      stream.destroy();
      //Second thing is to start fetching, with the new region
      console.log("Attempting to restart stream");
      fetch_tweets(io,newRegion); 
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

  function fetch_tweets(io,region) {
    console.log("FETCHING for "+region+":");
    var twitter = require('ntwitter');
    var config  = require('./config.json');
    var twit = new twitter({
      consumer_key: config.consumer_key,
      consumer_secret: config.consumer_secret,
      access_token_key: config.access_token_key,
      access_token_secret: config.access_token_secret
    }); 


    //Coordinates are from bottom left to top right in lon,lat
    switch (region) { 
      case "TheWorld":
        coordinates='-180,-90,180,90';
        break;
      case "US":
        coordinates='-129.199219,24.647017,-51.218262,48.821333';
        break; 
      case "California":
        coordinates='-124.148941,30.902225,-115.62355,41.95132';
        break;
      case "SantaCruz":
        coordinates='-122.07,36.9420,-121.91,37.05';
        break;
      case "Spain":
        coordinates='-10.580692,35.946883,3.976192,43.421009';
        break;
      default:
        coordinates='-180,-90,180,90';
        break;
    }

    corners=coordinates.split(",");
    twit.stream('statuses/filter', { 'locations':coordinates}, function(s) {
      stream = s;
      stream.on('data', function (data) {
        // Check if data.user is not undefined
        //console.log(data);
        if ( data.coordinates != null ) {
          buffer.push(data.coordinates.coordinates);
          if ( !data.coordinates.coordinates[0] == 0  && !data.coordinates.coordinates[1] == 0) { 
        //Making sure coordinates are withing boundary box    
       if ( data.coordinates.coordinates[0] < corners[0] || 
            data.coordinates.coordinates[0] > corners[2] ||
            data.coordinates.coordinates[1] < corners[1] ||
            data.coordinates.coordinates[1] > corners[3] ){
              var color="red"; 
       }
        //console.log(data.coordinates.coordinates[0]);
					io.sockets.emit('new_data', data.coordinates.coordinates, data.text, color); }
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
