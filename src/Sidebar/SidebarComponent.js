import React, { Component } from "react";
import NodeLevels from "./NodeLevels/NodeLevels";
import OtherNodesList from "./OtherNodesList/OtherNodesList";
import "./SidebarComponent.css";
import SizesBreakdown from "./SizesBreakdown/SizesBreakdown";

class Sidebar extends Component {
  state = {
    node: { name: "no selection" },
    parent: "",
    children: [],
    nodeLevels: [],
    leafNodes: [],
    subTreeNodes: [],
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
    let leafNodes = children.filter((d) => !d._children).map((d) => d.data),
      subTreeNodes = children
        .filter((d) => d._children)
        .map((d) => d.data.name);

    return { node, parent, children, nodeLevels, leafNodes, subTreeNodes };
  }

  render() {
    let { node, nodeLevels, leafNodes, subTreeNodes } = this.state;
    const isNodeSelected = node.name === "no selection";
    const isSubTreeExists = subTreeNodes.length > 0;
    return (
      <div className="App-sidebar">
        <NodeLevels isNodeSelected={isNodeSelected} nodeLevels={nodeLevels} />
        <SizesBreakdown
          isNodeSelected={isNodeSelected}
          node={node}
          leafNodes={leafNodes}
        />
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
