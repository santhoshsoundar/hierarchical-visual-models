import React, { Component } from "react";
import "./App.css";
import HeaderComponent from "./Header/HeaderComponent";
import SidebarComponent from "./Sidebar/SidebarComponent";
import ContentComponent from "./Content/ContentComponent";

class App extends Component {
  state = {
    data: {},
    idLoaded: false,
    nodeSubtreeData: null,
    error: null
  };

  componentDidMount() {
    fetch(`${process.env.PUBLIC_URL || ""}/data/poi_sequences.json`)
      .then(res => res.json())
      .then(res => {
        // function traverse(node) {
        //   if (node.children) {
        //     if (node.children.map(d => d.size).length > 1) {
        //       let leafNodes = node.children;
        //       node.children = [];
        //       node.children = leafNodes.sort((a, b) => a.size - b.size);
        //     } else {
        //       node.children.forEach(node => {
        //         traverse(node);
        //       });
        //     }
        //   }
        // }
        // traverse(res.report.data);
        return res;
      })
      .then(
        result => {
          this.setState({
            isLoaded: true,
            data: result.report.data
          });
        },
        error => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
  }

  updateNodeSubtree = treeData => {
    this.setState({
      nodeSubtreeData: treeData
    });
  };

  render() {
    const { data, error, isLoaded, nodeSubtreeData } = this.state;
    return (
      <div className="App">
        <div>
          <HeaderComponent />
          <ContentComponent
            data={data}
            isLoaded={isLoaded}
            error={error}
            updateNodeSubtree={this.updateNodeSubtree}
          />
        </div>
        <SidebarComponent subTreeData={nodeSubtreeData} />
      </div>
    );
  }
}

export default App;
