/* global d3 rawData */

/*

TODO
* Understand tip css - and look at examples
* Add date to data
* add title
* Thinl about colours
* Should x scale be ordinal?
* Eliminate gaps between bars
* Download data in code
* Compile to ES5
* Linting in VS Code?

*/

let dataset = rawData.data.map((xs) => xs[1]);

// Constants defining how the data is visualized
const margin = { top: 20, right: 20, bottom: 20, left: 50};
const svgWidth = 1000;
const svgHeight = 500;
const chartWidth = svgWidth - margin.left - margin.right;
const chartHeight = svgHeight - margin.top - margin.bottom;

const xScale= d3.scale.linear()
	.domain([0, dataset.length - 1])
	.range([0, chartWidth]);

const yScale = d3.scale.linear()
  .domain([0, d3.max(dataset)])
  .range([chartHeight, 0]);

const barWidth = chartWidth / dataset.length;

// Create SVG element
const svg =
	d3
  .select("body")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Create a group to contain the chart, and apply the margins
let chartGroup =
	svg
	.append("g")
	.attr("class", "chart")
	.attr("transform", translate(margin.left, margin.top));

// Add x-axis
const xAxis = d3.svg.axis()
  .scale(xScale)
  .orient("bottom");
chartGroup
	.append("g")
	.attr("class", "axis x-axis")
	.attr("transform", translate(0, chartHeight))
	.call(xAxis);

// Add y-axis
const yAxis =
	d3
	.svg
	.axis()
  .scale(yScale)
  .orient("left");
chartGroup
	.append("g")
		.attr("class", "axis y-axis")
    .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6) // Text anchor is about 6 units down from the top of the chart
      .attr("dy", ".71em") // Makes text anchor point about the cap height (instead of the bottom)
      .style("text-anchor", "end")
      .text("USA GDP");

const tip =
	d3
	.tip()
		.attr("class", "d3-tip")
		.offset([-10, 0])
		.html((d) => "<strong>$ " + d + " b</strong>");
	chartGroup
		.call(tip);

// Add bars
chartGroup
	.append("g")
		.selectAll("rect")
		.data(dataset)
		.enter()
		.append("rect")
			.attr("class", "bar")
			.attr("x", (d, i) => xScale(i))
			.attr("y", (d) => yScale(d))
			.attr("width", barWidth)
			.attr("height", (d) => chartHeight - yScale(d))
			.on("mouseover", tip.show)
      .on("mouseout", tip.hide);

// Helper function

function translate(x, y) {
  return "translate(" + x + ", " + y + ")";
}
