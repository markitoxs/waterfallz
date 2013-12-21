//////////////////////////////////
// Open a connection on page load
///////////////////////////////////

var socket = io.connect('http://'+window.location.host.split(':')[0]);

var moveme;
var centered;
var projection;
var svg;
var path;
var g;
var width;
var height;

window.onload = function() {

  /////////////////////////////////
  //Draw the initial map
  ////////////////////////////////
  var viewportWidth  = document.documentElement.clientWidth,
      viewportHeight = document.documentElement.clientHeight;

  width = viewportWidth,
        height = viewportHeight;


  projection = d3.geo.mercator();

  svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "svg-map");

  path = d3.geo.path()
    .projection(projection);

  g = svg.append("g");
  d3.json("world-110m.json", function(error, topology) {
      svg.append("path")
      .datum(topojson.feature(topology, topology.objects.countries))
      .attr("d", path);

      var coordinates = projection([-122.0263,36.9720])
      svg.append('svg:circle')
      .attr('cx', coordinates[0])
      .attr('cy', coordinates[1])
      .attr("fill","green")
      .attr('r', 5);
      });


}

window.onresize = function(event) {
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
    var coordinates = projection([data[0],data[1]])
    svg.append('svg:circle')
    .attr('cx', coordinates[0])
    .attr('cy', coordinates[1])
    .attr("fill","red")
    .attr('r', 2); 

});

//////////////////////////////////
// Draw map initially
//////////////////////////////////
function centerMap(point){

  projection.center(point)
  svg.selectAll("path").attr("d", path);
}


//////////////////////////////////
// Move point
//////////////////////////////////
function movePoint(point){

}

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

