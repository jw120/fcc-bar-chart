/* global d3 rawData */

/*

TODO
* add title
* Make README.md
* Thinl about colours
* Should x scale be ordinal?
* Eliminate gaps between bars
* Download data in code
* Compile to ES5
* Linting in VS Code?

*/

const dataset = rawData.data.map((xs) => { return { date: xs[0], gdp: xs[1] }; });
const maxGDP = d3.max(dataset.map((d) => d.gdp));

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
  .domain([0, maxGDP])
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
let chart =
  svg
  .append("g")
  .attr("class", "chart")
  .attr("transform", translate(margin.left, margin.top));

// Add x-axis
const xAxis = d3.svg.axis()
  .scale(xScale)
  .orient("bottom");
chart
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
chart
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
    .html(tooltipHTML);
chart
  .call(tip);

// Add bars
chart
  .append("g")
    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
      .attr("class", "bar")
      .attr("x", (d, i) => xScale(i))
      .attr("y", (d) => yScale(d.gdp))
      .attr("width", barWidth)
      .attr("height", (d) => chartHeight - yScale(d.gdp))
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide);

// Helper function


function tooltipHTML(d) {

  let year = d.date.substr(0, 4);
  let month = d.date.substr( 5, 2);
  let quarter = 1 + Math.floor((+month) / 3);

  let t =
    '<div class="tip-date">' +
    year + " Q" + quarter +
    "</div>" +
    '<div class="tip-gdp">' +
    "$ " + d.gdp + " b" +
    "</div>";

  return t;

}

function translate(x, y) {
  return "translate(" + x + ", " + y + ")";
}

