import React, { Component } from "react";
import * as d3 from "d3";

import "./Tree.css";
import Legend from "../Legend/Legend";
import Annotation from "../../Components/Annotation/Annotation";

const width = 832,
  margin = { top: 10, right: 40, bottom: 10, left: 40 },
  palette = {
    subtreeNode: "skyblue",
    leafNode: "dodgerblue",
    nodeFocus: "pink",
    nodeSelected: "orangered"
  },
  colorScale = d3.scaleOrdinal().range(d3.schemeTableau10),
  linkWidth = d3
    .scaleLog()
    .domain([1, 6000])
    .range([1, 12])
    .clamp(true),
  node_radius = 6,
  node_levels = 4,
  dy = width / node_levels,
  dx = 20;

let tree = d3.tree().nodeSize([dx, dy]),
  diagonal = d3
    .linkHorizontal()
    .x(d => d.y)
    .y(d => d.x);

class Tree extends Component {
  state = {
    data: {},
    isRendered: false
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { data } = nextProps;
    if (!data) return {};

    if (!prevState.isRendered) {
      const root = d3.hierarchy(data);

      const svg = d3
        .select("#rootsvg")
        .attr("viewBox", [-margin.left, -margin.top, width, dx])
        .style("font", "12px sans-serif")
        .style("user-select", "none");
      const gLink = svg
        .append("g")
        .attr("fill", "none")
        .attr("stroke", "#555")
        .attr("stroke-opacity", 0.4)
        .attr("stroke-width", 1);
      const gNode = svg
        .append("g")
        .attr("cursor", "pointer")
        .attr("pointer-events", "all");

      root.x0 = dy / 2;
      root.y0 = 0;
      root.descendants().forEach((d, i) => {
        d.id = i;
        d._children = d.children;
        if (d.depth > 0) d.children = null;
      });

      // Collapse the node and all it's children
      function collapse(d) {
        if (d.children && d.depth !== 1 && d.depth !== 0) {
          d._children = d.children;
          d._children.forEach(collapse);
          d.children = null;
        }
      }

      return { data, root, svg, gLink, gNode };
    } else {
      return {};
    }
  }

  updateTree = source => {
    let { root, svg, gLink, gNode } = this.state;
    const duration = d3.event && d3.event.altKey ? 2500 : 250;
    const nodes = root.descendants().reverse();
    const links = root.links();

    // Compute the new tree layout.
    tree(root);

    let left = root;
    let right = root;
    root.eachBefore(node => {
      if (node.x < left.x) left = node;
      if (node.x > right.x) right = node;
    });

    const height = right.x - left.x + margin.top + margin.bottom;

    const transition = svg
      .transition()
      .duration(duration)
      .attr("viewBox", [-margin.left, left.x - margin.top, width, height])
      .tween(
        "resize",
        window.ResizeObserver ? null : () => () => svg.dispatch("toggle")
      );

    // Update the nodes…
    const node = gNode
      .selectAll("g")
      .attr("class", "node")
      .data(nodes, d => d.id);

    // Enter any new nodes at the parent's previous position.
    const nodeEnter = node
      .enter()
      .append("g")
      .attr("transform", d => `translate(${source.y0},${source.x0})`)
      .attr("fill-opacity", 0)
      .attr("stroke-opacity", 0)
      .on("click", d => {
        d.children = d.children ? null : d._children;
        this.updateTree(d);
        this.props.nodeClicked(d);
      });

    node.selectAll("circle").attr("fill", d => {
      return d._children ? palette.subtreeNode : palette.leafNode;
    });

    let palleteCouter = 0;
    nodeEnter
      .append("circle")
      .attr("r", node_radius)
      .attr("fill", d => {
        if (!d._children) {
          let color = colorScale(palleteCouter);
          palleteCouter++;
          return color;
        }
        return palette.subtreeNode;
      })
      .attr("stroke-width", 10)
      .attr("pointer-events", d => (d._children ? "all" : "none"))
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut);

    nodeEnter
      .append("text")
      .attr("dy", "0.31em")
      .attr("x", d => (d._children ? -8 : 8))
      .attr("text-anchor", d => (d._children ? "end" : "start"))
      .text(d => d.data.name)
      .clone(true)
      .lower()
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 3)
      .attr("stroke", "white");

    nodeEnter
      .append("text")
      .attr("dy", "0.31em")
      .attr("x", d => (d._children ? 0 : -12))
      .attr("text-anchor", d => (d._children ? "start" : "end"))
      .text(d => (d.data.size ? `${d.data.size}` : ""))
      .clone(true)
      .lower()
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 3)
      .attr("stroke", "white");

    // Transition nodes to their new position.
    node
      .merge(nodeEnter)
      .transition(transition)
      .attr("transform", d => {
        return `translate(${d.y},${d.x})`;
      })
      .attr("fill-opacity", 1)
      .attr("stroke-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    node
      .exit()
      .transition(transition)
      .remove()
      .attr("transform", d => `translate(${source.y},${source.x})`)
      .attr("fill-opacity", 0)
      .attr("stroke-opacity", 0);

    function handleMouseOver(d) {
      if (d._children) {
        d3.select(this)
          .transition()
          .duration(300)
          .attr("r", node_radius)
          .attr("fill", palette.nodeFocus);
      }
    }

    function handleMouseOut(d) {
      if (d._children) {
        d3.select(this)
          .transition()
          .duration(100)
          .attr("r", node_radius)
          .attr("fill", d._children ? palette.subtreeNode : palette.leafNode);
      }
    }

    // Update the links…
    const link = gLink.selectAll("path").data(links, d => d.target.id);

    // Enter any new links at the parent's previous position.
    const linkEnter = link
      .enter()
      .append("path")
      .attr("d", d => {
        const o = { x: source.x0, y: source.y0 };
        return diagonal({ source: o, target: o });
      })
      .attr("stroke-width", d => {
        if (!d.target._children) {
          return linkWidth(d.target.data.size);
        }
        return 1;
      })
      .attr("stroke-opacity", 0.3);

    // Transition links to their new position.
    link
      .merge(linkEnter)
      .transition(transition)
      .attr("d", diagonal)
      .attr("stroke-width", d => {
        if (!d.target._children) {
          return linkWidth(d.target.data.size);
        }
        return 1;
      })
      .attr("stroke-opacity", 0.3);

    // Transition exiting nodes to the parent's new position.
    link
      .exit()
      .transition(transition)
      .remove()
      .attr("d", d => {
        const o = { x: source.x, y: source.y };
        return diagonal({ source: o, target: o });
      });

    // Stash the old positions for transition.
    root.eachBefore(d => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  };

  componentDidMount() {
    let { data, root } = this.state;
    if (data?.name && data?.children) this.updateTree(root);
  }

  componentDidUpdate() {
    let { data, root, isRendered } = this.state;
    if (data?.name && data?.children && !isRendered) {
      this.updateTree(root);
      this.setState({
        isRendered: true
      });
    }
  }

  legendLinkStyle = { fill: "#444", rx: "5", opacity: 0.3 };

  render() {
    return (
      <div>
        <div>
          <h3 class="heading">Hierarchical Tree </h3>
          <Annotation
            class="annotation"
            annotationText="Click a tree node to expand or collapse the tree. Leaf links had size encoded on a 'log' scale."
          />
        </div>
        <div className="legendLink">
          <svg width="330" height="28">
            <g>
              <rect
                x="20"
                y={15 - linkWidth(6000) / 2}
                width="40"
                height={linkWidth(6000)}
                style={this.legendLinkStyle}
              />
              <text x="65" dy="1.6em" style={{ fontSize: "12px" }}>
                6000
              </text>
              <rect
                x="110"
                y={15 - linkWidth(100) / 2}
                width="40"
                height={linkWidth(100)}
                style={this.legendLinkStyle}
              />
              <text x="155" dy="1.6em" style={{ fontSize: "12px" }}>
                100
              </text>
              <rect
                x="190"
                y={15 - linkWidth(25) / 2}
                width="40"
                height={linkWidth(25)}
                style={this.legendLinkStyle}
              />
              <text x="235" dy="1.6em" style={{ fontSize: "12px" }}>
                50
              </text>
              <rect
                x="260"
                y={15 - linkWidth(5) / 2}
                width="40"
                height={linkWidth(5)}
                style={this.legendLinkStyle}
              />
              <text x="305" dy="1.6em" style={{ fontSize: "12px" }}>
                5
              </text>
            </g>
          </svg>
        </div>
        <div className="legend">
          <Legend labelText={"Tree Node"} color={palette.subtreeNode} />
          <Legend labelText={"Leaf Node"} color={palette.leafNode} />
        </div>
        <svg id="rootsvg" />
      </div>
    );
  }
}

export default Tree;
