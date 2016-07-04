/* global d3 rawData */

const timeFormat = d3.time.format("%Y-%m-%d");
const dataset = rawData.data.map((xs) => { return { date: timeFormat.parse(xs[0]), gdp: xs[1] }; });
const maxGDP = d3.max(dataset.map((d) => d.gdp));

// Constants defining how the data is visualized
const margin = { top: 50, right: 20, bottom: 80, left: 50};
const svgWidth = 800;
const svgHeight = 600;
const chartWidth = svgWidth - margin.left - margin.right;
const chartHeight = svgHeight - margin.top - margin.bottom;
const barGap = -0.5; // Gap between bars (negative to make sure they overlap)
const barWidth = chartWidth / dataset.length - barGap;


const xScale= d3.time.scale()
  .domain([dataset[0].date, dataset[dataset.length - 1].date])
  .range([0, chartWidth]);

const yScale = d3.scale.linear()
  .domain([0, maxGDP])
  .range([chartHeight, 0]);

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
      .text("$ Billions (seasonly adjusted)");


// Add title and source
chart
  .append("text")
    .attr("class", "title")
    .attr("x", chartWidth * 0.5)
    .attr("y", chartHeight * 0.1)
    .attr("text-anchor", "middle")
    .text("U.S. Gross Domestic Product");
chart
  .append("a")
    .attr("xlink:href", "http://www.bea.gov/national/pdf/nipaguid.pdf")
    .append("text")
      .attr("class", "source")
      .attr("x", chartWidth * 0.5)
      .attr("y", chartHeight + margin.bottom * 0.5)
      .attr("text-anchor", "middle")
      .text("See: A Guide to the National Income and Product Accounts of the United States, " +
            "http://www.bea.gov/national/pdf/nipaguid.pdf");

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
      .attr("x", (d) => xScale(d.date))
      .attr("y", (d) => yScale(d.gdp))
      .attr("width", barWidth)
      .attr("height", (d) => chartHeight - yScale(d.gdp))
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide);

// Helper functions

function tooltipHTML(d) {

  let quarter = 1 + Math.floor((d.date.getMonth()) / 3);

  let t =
    '<div class="tip-date">' +
    d.date.getFullYear() + " Q" + quarter +
    "</div>" +
    '<div class="tip-gdp">' +
    "$ " + addCommas(d.gdp) + " b" +
    "</div>";

  return t;

}

function translate(x, y) {
  return "translate(" + x + ", " + y + ")";
}

// Helper function to add commas to a number
function addCommas(x) {

  if (typeof x === "number") {
    return (x < 0) ? "-" + addCommas((-x).toString()) : addCommas(x.toString());
  }

  let point = x.indexOf(".");
  if (point !== -1) {
    return addCommas(x.substr(0, point)) + x.substr(point);
  }

  if (x.length > 3) {
    return addCommas(x.substr(0, x.length - 3)) + "," + x.substr(-3);
  }

  return x;

}