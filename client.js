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
var tooltip;
var pointCount;

////////////////////////////////////////////
//Create the projection like so: 
//
//var projection = d3.geo.albers() 
//.translate([width / 2, height / 2]) 
//.scale(scale) 
////.rotate([-longitude, 0]) 
//.center([0, latitude]); 
//////////////////////////////////////


window.onload = function() {

  tooltip = d3.select("body")
    .append('div')
    .attr("class", "tool")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .text("a simple tooltip")
              
  ////////////////////////////////
  //Draw the initial map
  ////////////////////////////////
  centerWorld();

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

socket.on('new_data', function (coordinates,text,color) {
    addPoint(coordinates,text,color);
});


//////////////////////////////////
// Draw world map
//////////////////////////////////
function centerWorld() {
  // delete map
  d3.select("svg")
    .remove();

  var viewportWidth  = document.documentElement.clientWidth,
      viewportHeight = document.documentElement.clientHeight;

  width = viewportWidth;
  height = viewportHeight;

  svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("id", "svg-map");


  projection = d3.geo.mercator()
    .center([-30,50])
    .scale(250);

  path = d3.geo.path()
    .projection(projection);

  g = svg.append("g");

  d3.json("world-110m.json", function(error, topology) {
      svg.append("path")
      .datum(topojson.feature(topology, topology.objects.countries))
      .attr("d", path);
      }); 



}



//////////////////////////////////
//////////////////////////////////
// Change Map center to the US
//////////////////////////////////
//Middle of the US: -100,40`
function centerUS() {

 // delete map
  d3.select("svg")
           .remove();

  var viewportWidth  = document.documentElement.clientWidth,
      viewportHeight = document.documentElement.clientHeight;

  width = viewportWidth;
  height = viewportHeight;

  svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("id", "svg-map");


  projection = d3.geo.conicConformal()
    .rotate([98, 0])
    .center([0, 38])
    .parallels([29.5, 45.5])
    .scale(1000)
    .translate([width / 2, height / 2])
    .precision(.1);

  path = d3.geo.path()
    .projection(projection);

  g = svg.append("g");

  d3.json("world-110m.json", function(error, topology) {
      svg.append("path")
      .datum(topojson.feature(topology, topology.objects.countries))
      .attr("d", path);
      }); 



}
//////////////////////////////////////////
// Change Map center to California
//////////////////////////////////
//Middle of the Cali
function centerCalifornia() {

 // delete map
  d3.select("svg")
           .remove();

  var viewportWidth  = document.documentElement.clientWidth,
      viewportHeight = document.documentElement.clientHeight;

  width = viewportWidth;
  height = viewportHeight;

  svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("id", "svg-map");

  projection = d3.geo.albers() 
    .translate([width/2,height/2]) 
    .scale(2900) 
    .rotate([122.4183, 0]) 
    .center([0, 37.7750]); 

  path = d3.geo.path()
    .projection(projection);

  g = svg.append("g");

  d3.json("world-110m.json", function(error, topology) {
      svg.append("path")
      .datum(topojson.feature(topology, topology.objects.countries))
      .attr("d", path);
      }); 



}


//////////////////////////////////////////
// Change Map center to SantaCruz
//////////////////////////////////
//Middle of SCZ
function centerSantaCruz() {
console.log("SANTA CRUZ");
 // delete map
  d3.select("svg")
           .remove();

  var viewportWidth  = document.documentElement.clientWidth,
      viewportHeight = document.documentElement.clientHeight;

  width = viewportWidth;
  height = viewportHeight;

  svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("id", "svg-map");

  projection = d3.geo.albers() 
    .translate([width/2,height/2])
    .scale(7500) 
    .rotate([121.905885, 0]) 
    .center([0,36.949892]); 

  path = d3.geo.path()
    .projection(projection);

  g = svg.append("g");

  d3.json("world-110m.json", function(error, topology) {
      svg.append("path")
      .datum(topojson.feature(topology, topology.objects.countries))
      .attr("d", path);
      }); 



}

//////////////////////////////////////////
// Change Map center to Spain
//////////////////////////////////
//Middle of Spain
function centerSpain() {
console.log("Spain");
 // delete map
  d3.select("svg")
           .remove();

  var viewportWidth  = document.documentElement.clientWidth,
      viewportHeight = document.documentElement.clientHeight;

  width = viewportWidth;
  height = viewportHeight;

  svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("id", "svg-map");

  projection = d3.geo.albers() 
    .translate([width/2,height/2])
    .scale(3500)
    .rotate([-3.6833, 0]) 
    .center([0,40.4000]); 

  path = d3.geo.path()
    .projection(projection);

  g = svg.append("g");

  d3.json("world-110m.json", function(error, topology) {
      svg.append("path")
      .datum(topojson.feature(topology, topology.objects.countries))
      .attr("d", path);
      }); 



}

//////////////////////////////////
// Move point
//////////////////////////////////
function addPoint(point,text,color){
  if ( color == "red") {
    circleColor="#FF0000";
  }
  else {
    circleColor="#A4E03D";
  }
  //draw circle
  var coordinates = projection([point[0],point[1]])
    // If tweet number 10, then add tooltip anyways
    if ( pointCount == 10 )
    {
     pointCount=0;
     tooltip.text(text);
     //move it to where the point is
    
    }
    else {
      pointCount = pointCount+1;
    }
    svg.append('svg:circle')
    .attr('cx', coordinates[0])
    .attr('cy',coordinates[1])
    .attr("fill","white")
    .attr('r',1)
    .on("mouseover", function(){
       //Get twitter text
       tooltip.text(text);
       tooltip.style("visibility", "visible");
       })
      
    .on("mousemove", function(){
       tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
       })
    .on("mouseout", function(){
        tooltip.style("visibility", "hidden");
        })
    .transition()
      .duration(5050)   
      .attr("fill",circleColor)
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
// Add text
//////////////////////////////////
function displayTweet(text,coordinates){
  //Add the text with the box
  var text = svg.append("svg:text")
    .attr("x", coordinates[0])
    .attr("y", coordinates[1]-10)
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .style("font", "300 14px Helvetica Neue")
    .text(text)
    .transition()
      .duration(5050)
      .each("end",function(){
          d3.select(this).
          transition()
          .duration(100)
          .each("end",function(){ d3.select(this).remove();})
            });
  var bbox = text.node().getBBox();

  var rect = svg.append("svg:rect")
    .attr("x", bbox.x)
    .attr("y", bbox.y)
    .attr("width", bbox.width)
    .attr("height", bbox.height)
    .style("fill", "white")
    .style("fill-opacity", ".3")
    .style("stroke", "black")
    .style("stroke-width", "1.5px")
    .transition()
      .duration(5050)
      .each("end",function(){
          d3.select(this).
          transition()
          .duration(100)
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
  region=mylist.options[mylist.selectedIndex].text;
  console.log("Region is: "+region);
  socket.emit('change_region',region);
  switch (region) {
    case "US":
      centerUS();
      break;
    case "California":
      centerCalifornia();
      break;
    case "SantaCruz":
      centerSantaCruz();
      break;
    case "Spain":
      centerSpain();
      break;
    default:
      centerWorld();
      break;
  }
}

