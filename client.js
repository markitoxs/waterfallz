
var print = function(m, p) {
	changebox(m);
};

function changebox(data){
  console.log($('#counter').text());
  var counter_value = parseInt($('#counter').text());
  counter_value = counter_value + 1;
 
  //Find a smart way to decide on HEX color code 
  color=get_random_color(); 
  var boxcode='<div id="square" style="background-color:'+color+'"></div>'
  $('#line').prepend(boxcode);
  $('#tweet').text(data); 
  $('#counter').text(counter_value);
  }


var socket = io.connect('http://localhost');
  socket.on('new_tweet', function (data) {
    changebox(data);
    //console.log(data);
    //socket.emit('reply', "ACK");
  });

function get_random_color() {
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++ ) {
    color += letters[Math.round(Math.random() * 15)];
  }
  return color;
}

