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
    nodeFocus: "orangered",
    nodeSelected: "orangered"
  },
  node_radius = 5,
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
        if (d.depth && d.data.name.length !== 7) d.children = null;
      });

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
    const node = gNode.selectAll("g").data(nodes, d => d.id);

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

    nodeEnter
      .append("circle")
      .attr("r", node_radius)
      .attr("fill", d => (d._children ? palette.subtreeNode : palette.leafNode))
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

    // Transition nodes to their new position.
    node
      .merge(nodeEnter)
      .transition(transition)
      .attr("transform", d => `translate(${d.y},${d.x})`)
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
          .attr("r", 5)
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
      });

    // Transition links to their new position.
    link
      .merge(linkEnter)
      .transition(transition)
      .attr("d", diagonal);

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

  render() {
    return (
      <div>
        <h3>Hierarchical Tree </h3>
        <Annotation annotationText="Click a tree node to expand or collapse the tree." />
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
