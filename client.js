///////////////////////////////////
// Open a connection on page load
///////////////////////////////////

var socket = io.connect('http://'+window.location.host.split(':')[0]);

setInterval(consume,400);

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
  preload_image(data);
});


//////////////////////////////////
// How to add a new box with image
//////////////////////////////////

function changeicon(url){
  console.log("Image loaded, updating DOM");
  var counter_value = parseInt($('#counter').text());
  counter_value = counter_value +1;
  link=url;
  var boxcode='<div id="square" style="background-color:white"><img src="'+link+'"></img>'
  $('#line').prepend(boxcode).fadeIn(slow);
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

