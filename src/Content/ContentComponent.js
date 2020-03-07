import React from "react";
import "./ContentComponent.css";
import Tree from "./Tree/Tree";

function ContentComponent(props) {
  const { isLoaded, error, data, updateNodeSubtree } = props;
  return (
    <div className="App-content">
      {isLoaded && error ? (
        <div>Error Loading POI data</div>
      ) : (
        <Tree data={data} nodeClicked={updateNodeSubtree} />
      )}
    </div>
  );
}

export default ContentComponent;
