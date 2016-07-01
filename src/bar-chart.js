/*

TODO
* Scaling
* Add date to data
* Axes/labels
* Mouseover
* Compile to ES5

*/

// The data to be visualized
//var dataset = [ 5, 10, 13, 19, 21, 25, 22, 18, 15, 13,
//    						11, 12, 15, 20, 18, 17, 16, 18, 23, 25 ];

let dataset = rawData.data.map((xs) => xs[1]);

console.log(dataset[0], dataset[1]);

// Constants defining how the data is visualized
const w = 1000;
const h = 500;
const barPadding = 0.1;

// Create SVG element
let svg = d3
  .select("body")
  .append("svg")
  .attr("width", w)
  .attr("height", h);

svg
  .selectAll("rect")
  .data(dataset)
  .enter()
  .append("rect")
  .attr("x", (d, i) => i * (w / dataset.length))
  .attr("y", (d) => h - (d * 0.025))
  .attr("width", w / dataset.length - barPadding)
  .attr("height", (d) => d * 0.025)
  .attr("fill", (d) => "rgb(0, 0, " + (d * 10) + ")");

			// svg.selectAll("text")
			//    .data(dataset)
			//    .enter()
			//    .append("text")
			//    .text(function(d) {
			//    		return d;
			//    })
			//    .attr("text-anchor", "middle")
			//    .attr("x", function(d, i) {
			//    		return i * (w / dataset.length) + (w / dataset.length - barPadding) / 2;
			//    })
			//    .attr("y", function(d) {
			//    		return h - (d * 4) + 14;
			//    })
			//    .attr("font-family", "sans-serif")
			//    .attr("font-size", "11px")
			//    .attr("fill", "white");

