///////////////////////////////////
// Open a connection on page load
///////////////////////////////////

var socket = io.connect('http://'+window.location.host.split(':')[0]);

///////////////////////////
// Start with paperjs
//////////////////////////
paper.install(window);
var moveme;

window.onload = function() {
  // Setup directly from canvas id:
  paper.setup('myCanvas');
  var myCircle = new Path.Circle(new Point(100, 70), 50);
  myCircle.fillColor = 'black';
  myCircle.position = view.center;
  moveme = myCircle;
}

//setInterval(consume,400);

///////////////////////////////////
// What to do on new_tweet event
///////////////////////////////////

socket.on('new_tweet', function (data) {
	changebox(data);
	socket.emit('reply', $('#counter').text());
});

///////////////////////////////////
// What to do on new_data
///////////////////////////////////

socket.on('new_data', function (data) {
  console.log(data);
  geolocate(data);
});


//////////////////////////////////
// How to add a new box with image
//////////////////////////////////

function changeicon(url){
  console.log("Image loaded, updating DOM");
  var counter_value = parseInt($('#counter').text());
  counter_value = counter_value +1;
  link=url;
  selector='#id'+counter_value;
  var boxcode='<div class="square" id="id'+counter_value+'" style="background-color:white; display:none"><img src="'+link+'" style"></div';
  $('#line').prepend(boxcode);
  $(selector).fadeIn(2000);
  $('#counter').text(counter_value);

}

//////////////////////////////////
// How to prefetch the image
//////////////////////////////////

function preload_image(url){
  console.log("Prefetching Image"); 
  objImage = new Image();
  objImage.src=url;
  objImage.onload=changeicon(url);

}

///////////////////////////////////
// How to request a new image
///////////////////////////////////

function consume(){
  console.log("requesting image to server");
  socket.emit('consume');
}

///////////////////////////////////
// Handle the coordinates
//////////////////////////////////

function geolocate(points){
  x = Maths.abs(points[0] * 25);
  y = Maths.abs(points[1] * 1); 
	
  moveme.position = new Point(x,y);
}
