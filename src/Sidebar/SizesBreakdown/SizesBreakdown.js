import React from "react";
import Annotation from "../../Components/Annotation/Annotation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartPie } from "@fortawesome/free-solid-svg-icons";
import DonutChart from "../Donut/DonutChart";
import Divider from "../../Components/Divider/Divider";
import "./SizesBreakdown.css";

function SizesBreakdown(props) {
  const { isNodeSelected, leafNodes, node } = props;
  return (
    <React.Fragment>
      <h3>
        <FontAwesomeIcon icon={faChartPie} className="sidebar-title-icon" />
        Sizes Breakdown{" "}
      </h3>
      {!isNodeSelected && (
        <span className="header-meta"> [leaf order retained]</span>
      )}
      {isNodeSelected && (
        <div className="sizes-annotation">
          <Annotation annotationText={"make a node selection"} />
        </div>
      )}
      {!isNodeSelected && <h5 className="selected-node">{node.name}</h5>}
      {!isNodeSelected && <DonutChart data={leafNodes} />}
      <Divider />
    </React.Fragment>
  );
}

export default SizesBreakdown;
