var _height = 500;
var _width = 500;

function asyncCounter(numCalls, callback){
    this.callback = callback;
    this.numCalls = numCalls;
    this.calls = 0;
};

asyncCounter.prototype.increment = function(){
	this.calls++
    if(this.calls >= this.numCalls){
        this.callback();
    }
};

var myAsyncCounter = new asyncCounter(3, draw);

var _wpdata;
var _codata;
d3.xml("..\\waypoints.xml", function(error, data){
 if (error) throw error;
      // Convert the XML document to an array of objects.
      // Note that querySelectorAll returns a NodeList, not a proper Array,
      // so we must use map.call to invoke array methods.
      _wpdata = [].map.call(data.querySelectorAll("wp"), function(wp) {
        return {
          id: wp.getAttribute("id"),
          lat: parseFloat(wp.getAttribute("lat")),
	  lon: parseFloat(wp.getAttribute("lon"))
	};
      });

      _codata = [].map.call(data.querySelectorAll("course"), function(course) {
        return {
          name: course.getAttribute("name"),
          length: course.getAttribute("length"),
          wps: [].map.call(course.querySelectorAll("m"), function(mark) {
        	return {
          	  id: mark.getAttribute("id")
         	}
      		})
        };
      });
	myAsyncCounter.increment();
})


var _cdata;
d3.xml("..\\classes.xml", function(error, data){
 if (error) throw error;
      // Convert the XML document to an array of objects.
      // Note that querySelectorAll returns a NodeList, not a proper Array,
      // so we must use map.call to invoke array methods.
      _cdata = [].map.call(data.querySelectorAll("section"), function(section) {
        return {
          id: section.getAttribute("id"),
          start: section.getAttribute("start"),
          boats: [].map.call(section.querySelectorAll("boat"), function(boat){
              return{
              id: boat.getAttribute("id"),
              positions: [].map.call(boat.querySelectorAll("p"), function(p){
                      return{
                      time: p.getAttribute("t"),
                      lat: parseFloat(p.getAttribute("l")),
                      lon: parseFloat(p.getAttribute("o"))}
                      })
              }
          })
         };
      });
myAsyncCounter.increment();
})


var _rdata;
d3.xml("racedata.xml", function(error, data) {
  if (error) throw error;

      // Convert the XML document to an array of objects.
      // Note that querySelectorAll returns a NodeList, not a proper Array,
      // so we must use map.call to invoke array methods.
      _rdata = [].map.call(data.querySelectorAll("section"), function(section) {
        return {
          id: section.getAttribute("id"),
          start: section.getAttribute("start"),
          boats: [].map.call(section.querySelectorAll("boat"), function(boat){
              return{
              id: boat.getAttribute("id"),
              positions: [].map.call(boat.querySelectorAll("p"), function(p){
                      return{
                      time: p.getAttribute("t"),
                      lat: parseFloat(p.getAttribute("l")),
                      lon: parseFloat(p.getAttribute("o"))
			}
                      })
              }
          })
         };
      });
myAsyncCounter.increment();
})

function draw(){

var scaleLon = d3.scale.linear()
	.domain([-87.61, -87.38 ])
	.range([0, _width])
var scaleLat = d3.scale.linear()
	.domain([41.93, 41.78])
	.range([0, _height])

var axisLon = d3.svg.axis()
	.ticks(5)
	.orient("bottom")
	.scale(scaleLon);

var axisLat = d3.svg.axis()
	.ticks(5)
	.orient("left")
	.scale(scaleLat);

var canvas = d3.select("body").append("svg")
      .attr("width", _width)
      .attr("height", _height);

var marks = canvas.selectAll("circle")
	.data(_wpdata)
	.enter()
		.append("circle")
		.attr("cy", function(d){return scaleLat(d.lat);})
		.attr("cx", function(d){return scaleLon(d.lon);})
		.attr("r", 10)
		.attr("fill", "red");

canvas.append("g")
	.attr("class", "axis")
	.attr("transform", "translate(0, 400)")
	.call(axisLon);

canvas.append("g")
	.attr("class", "axis")
	.attr("transfrorm", "translate(50,0)")
	.call(axisLat);

}
