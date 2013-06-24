
function changebox(data){
  var counter_value = parseInt($('#counter').text());
  counter_value = counter_value + 1;
 
  color=data;
  var boxcode='<div id="square" style="background-color:'+color+'"></div>'
  $('#line').prepend(boxcode);
  $('#counter').text(counter_value);
}


var socket = io.connect('http://192.168.98.30');
socket.on('new_tweet', function (data) {
	changebox(data);
	//console.log(data);
	socket.emit('reply', $('#counter').text());
});


