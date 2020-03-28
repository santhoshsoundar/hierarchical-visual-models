import React from "react";
import Annotation from "../../Components/Annotation/Annotation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faProjectDiagram } from "@fortawesome/free-solid-svg-icons";
import "./OtherNodesList.css";

function OtherNodesList(props) {
  const { isNodeSelected, isSubTreeExists, subTreeNodes, node } = props;
  return (
    <React.Fragment>
      <h3>
        <FontAwesomeIcon icon={faProjectDiagram} className="header-icon" />
        Other Sub-Tree Nodes
      </h3>
      <div className="subtree-nodes">
        {subTreeNodes.map((d, i) => {
          return <div key={i}>{d}</div>;
        })}
      </div>
      {!isSubTreeExists && isNodeSelected && (
        <Annotation annotationText={"make a node selection"} />
      )}
      {!isSubTreeExists && !isNodeSelected && (
        <Annotation annotationText={`no sub-tree node found at ${node.name}`} />
      )}
    </React.Fragment>
  );
}

export default OtherNodesList;
