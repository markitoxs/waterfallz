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

  projection = d3.geo.mercator()
    .center([-30,50])
    .scale(250);
  //projection = d3.geo.orthographic();
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

    addPoint(data);

});



//////////////////////////////////
// Move point
//////////////////////////////////
function addPoint(point){
  //draw circle
  var coordinates = projection([point[0],point[1]])
    svg.append('svg:circle')
    .attr('cx', coordinates[0])
    .attr('cy',coordinates[1])
    .attr("fill","white")
    .attr('r',1)
    .transition()
    .duration(5050)   
    .attr("fill","#A4E03D")
    .attr('r', 10) 
    .each("end",function() { 
        d3.select(this).       // so far, as above
        transition()
        .duration(3000)
        .attr('r',0)
        .attr("fill","white")
        .each("end",function(){ d3.select(this).remove();})
        }); 

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


///////////////////////////////////////
// Get form value
//////////////////////////////////////
function getRegion()
{
  var mylist=document.getElementById("myList");
  document.getElementById("favorite").value=mylist.options[mylist.selectedIndex].text;
}

