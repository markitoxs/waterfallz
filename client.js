
function changebox(data){
  var counter_value = parseInt($('#counter').text());
  counter_value = counter_value + 1;
 
  color=data;
  var boxcode='<div id="square" style="background-color:'+color+'"></div>'
  $('#line').prepend(boxcode);
  $('#counter').text(counter_value);
}

window
var socket = io.connect('http://'+window.location.host.split(':')[0]);
socket.on('new_tweet', function (data) {
	changebox(data);
	//console.log(data);
	socket.emit('reply', $('#counter').text());
});


