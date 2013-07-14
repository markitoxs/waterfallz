function changeicon(url){
  console.log("Image loaded, updating DOM");
  var counter_value = parseInt($('#counter').text());
  counter_value = counter_value +1;
  link=url;
  var boxcode='<div id="square"><img src="'+link+'"></img>'
  $('#line').prepend(boxcode);
  $('#counter').text(counter_value);

  socket.emit('reply', $('#counter').text());
}

function preload_image(url){
  console.log("Prefetching Image"); 
  objImage = new Image();
  objImage.src=url;
  objImage.onload=changeicon(url);

}

function changebox(data){
  var counter_value = parseInt($('#counter').text());
  counter_value = counter_value + 1;
 
  color=data;
  var boxcode='<div id="square" style="background-color:'+color+'"></div>'
  $('#line').prepend(boxcode);
  $('#counter').text(counter_value);
}

var socket = io.connect('http://'+window.location.host.split(':')[0]);
socket.on('new_tweet', function (data) {
	changebox(data);
	//console.log(data);
	socket.emit('reply', $('#counter').text());
});

socket.on('new_data', function (data) {
  console.log(data);
  preload_image(data);
  //socket.emit('reply', $('#counter').text());
});
