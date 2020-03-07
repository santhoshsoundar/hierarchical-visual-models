import React, { Component } from "react";
import * as d3 from "d3";

import "./DonutChart.css";

const width = 300,
  height = 150,
  colorScale = d3.scaleOrdinal().range(d3.schemeTableau10),
  arcGenerator = d3
    .arc()
    .innerRadius(height * 0.65)
    .outerRadius(height)
    .cornerRadius(3)
    .padAngle(0.01)
    .startAngle(d => d.startAngle)
    .endAngle(d => d.endAngle),
  legendRectSize = 14,
  legendSpacing = 4,
  legendPadding = 10;

class DonutChart extends Component {
  state = {
    data: [],
    labels: []
  };

  static getDerivedStateFromProps(nextProps) {
    const { data } = nextProps;
    if (!data) return {};

    const labels = data.map(d => d.name);
    const pieBoundaries = d3
      .pie()
      .startAngle(-90 * (Math.PI / 180))
      .endAngle(90 * (Math.PI / 180))
      .sort(null)
      .value(d => d.size)(data);

    return { data, labels, pieBoundaries };
  }

  updateDonut = () => {
    let { data, svg, labels, pieBoundaries } = this.state;
    if (svg) {
      svg.selectAll("path").remove();
      svg.selectAll("g").remove();
      svg
        .selectAll("path")
        .data(pieBoundaries)
        .enter()
        .append("path")
        .attr("d", d => arcGenerator(d))
        .attr("transform", `translate(${width / 2},${height})`)
        .attr("stroke", "white")
        .attr("fill", (d, i) => colorScale(i));

      let legendG = svg
        .append("g")
        .attr("transform", `translate(${width / 5},${height + legendPadding})`);

      let legend = legendG
        .selectAll(".donut-legend")
        .data(labels)
        .enter()
        .append("g")
        .attr("class", "donut-legend")
        .attr("transform", function(d, i) {
          let height = legendRectSize + legendSpacing;
          var vert = i * height;
          return "translate(10," + vert + ")";
        });

      legend
        .append("rect")
        .attr("width", legendRectSize)
        .attr("height", legendRectSize)
        .style("fill", (d, i) => colorScale(i))
        .style("stroke", (d, i) => colorScale(i))
        .style("rx", 3)
        .style("ry", 3);

      legend
        .append("text")
        .attr("x", legendRectSize + legendSpacing)
        .attr("y", legendRectSize - legendSpacing / 1.5)
        .text(function(d, i) {
          return `${d} (${data[i].size})`;
        });
    }
  };

  componentDidMount() {
    let { data } = this.state;
    if (data) {
      let svg = d3.select("#donut-chart").style("user-select", "none");
      this.setState({
        svg
      });
      this.updateDonut();
    }
  }

  componentDidUpdate() {
    let { data } = this.state;
    if (data) this.updateDonut();
  }

  render() {
    let { labels } = this.state;
    let svgHeight =
      labels.length > 0 ? height + labels.length * 18 + legendPadding : height;
    return (
      <div className="donut-container">
        <svg id="donut-chart" with={width} height={svgHeight} />
      </div>
    );
  }
}

export default DonutChart;
