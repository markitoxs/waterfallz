
var print = function(m, p) {
	changebox(m);
};

function changebox(data){
//  console.log($('#counter').text());
  var counter_value = parseInt($('#counter').text());
  counter_value = counter_value + 1;
 
  //Find a smart way to decide on HEX color code 
  color=stringToColour(data);
  var boxcode='<div id="square" style="background-color:'+color+'"></div>'
  $('#line').prepend(boxcode);
//  $('#tweet').text(data); 
  $('#counter').text(counter_value);
  }


var socket = io.connect('http://localhost');
  socket.on('new_tweet', function (data) {
    changebox(data);
    //console.log(data);
    socket.emit('reply', $('#counter').text());
  });

function get_random_color() {
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++ ) {
    color += letters[Math.round(Math.random() * 15)];
  }
  return color;
}
var stringToColour = function(str) {
  // str to hash
  for (var i = 0, hash = 0; i < str.length; hash = str.charCodeAt(i++) + ((hash << 5) - hash));

  // int/hash to hex
  for (var i = 0, colour = "#"; i < 3; colour += ("00" + ((hash >> i++ * 8) & 0xFF).toString(16)).slice(-2));

  return colour;
}

