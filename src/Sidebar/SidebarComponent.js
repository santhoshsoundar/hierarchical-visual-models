import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartPie } from "@fortawesome/free-solid-svg-icons";
import DonutChart from "./Donut/DonutChart";
import Annotation from "../Components/Annotation/Annotation";
import Divider from "../Components/Divider/Divider";
import NodeLevels from "./NodeLevels/NodeLevels";
import OtherNodesList from "./OtherNodesList/OtherNodesList";
import "./SidebarComponent.css";

class Sidebar extends Component {
  state = {
    node: { name: "no selection" },
    parent: "",
    children: [],
    nodeLevels: [],
    leafNodes: [],
    subTreeNodes: []
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { subTreeData } = nextProps;
    if (
      !subTreeData ||
      !subTreeData?.data ||
      !subTreeData?.parent?.data ||
      !subTreeData?.children
    ) {
      return {};
    }
    const node = subTreeData.data,
      parent = subTreeData.parent.data.name,
      children = subTreeData.children;

    let nodeLevels = ["root"];
    if (parent === "root") {
      nodeLevels.push(node.name);
    } else {
      nodeLevels.push(parent);
      nodeLevels.push(node.name);
    }
    let leafNodes = children.filter(d => !d._children).map(d => d.data),
      subTreeNodes = children.filter(d => d._children).map(d => d.data.name);

    return { node, parent, children, nodeLevels, leafNodes, subTreeNodes };
  }

  render() {
    let { node, nodeLevels, leafNodes, subTreeNodes } = this.state;
    const isNodeSelected = node.name === "no selection";
    const isSubTreeExists = subTreeNodes.length > 0;
    return (
      <div className="App-sidebar">
        <NodeLevels isNodeSelected={isNodeSelected} nodeLevels={nodeLevels} />
        <div className="header-wrapper">
          <h3 className="header-title">
            <FontAwesomeIcon icon={faChartPie} className="header-icon" /> Sizes
            Breakdown{" "}
          </h3>
          {!isNodeSelected && (
            <span className="header-meta"> [leaf order retained]</span>
          )}
        </div>
        {isNodeSelected && (
          <Annotation annotationText={"make a node selection"} />
        )}
        {!isNodeSelected && <h5 className="selected-node">{node.name}</h5>}
        {!isNodeSelected && <DonutChart data={leafNodes} />}
        <Divider />
        <OtherNodesList
          isNodeSelected={isNodeSelected}
          isSubTreeExists={isSubTreeExists}
          subTreeNodes={subTreeNodes}
          node={node}
        />
      </div>
    );
  }
}

export default Sidebar;
