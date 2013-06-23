
var div  = $('#tweet div');
var inp  = $('#tweet input');
var form = $('#tweet form');

var print = function(m, p) {
	p = (p === undefined) ? '' : JSON.stringify(p);
	//div.prepend($("<code>").text(m + ' ' + p));
	changebox(m);
};

function changebox(data){
  //Need to make sure there are vowels
	var as = 0;
  var es = 0;
  var is = 0;
  var os = 0;
  var us = 0;

	if (data == null ) {
		data = "aeiou";
	}

  if (data.match(/a/gi)) {
    as = data.match(/a/gi).length;
  }
  if (data.match(/e/gi)) {
    es = data.match(/e/gi).length;
  }
  if (data.match(/i/gi)) {
    is = data.match(/i/gi).length;
  }
  if (data.match(/o/gi)) {
    os = data.match(/o/gi).length;
  }
  if (data.match(/u/gi)) {
    us = data.match(/u/gi).length;
  }

  $('#box_a').css('background-color','blue');
  $('#box_a').animate({
  'width': as*30 });
  
  $('#box_e').css('background-color','red');
  $('#box_e').animate({
  'width': es*30 });

  $('#box_i').css('background-color','green');
  $('#box_i').animate({
  'width': is*30 });

  $('#box_o').css('background-color','yellow');
  $('#box_o').animate({
  'width': os*30 });

  $('#box_u').css('background-color','pink');
  $('#box_u').animate({
  'width': us*30 });
  }


var socket = io.connect('http://localhost');
  socket.on('new_tweet', function (data) {
    changebox(data);
    console.log(data);
    socket.emit('reply', "ACK");
  });
