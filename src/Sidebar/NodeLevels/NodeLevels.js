import React from "react";
import Spacer from "react-add-space";
import Annotation from "../../Components/Annotation/Annotation";
import Divider from "../../Components/Divider/Divider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faSitemap } from "@fortawesome/free-solid-svg-icons";
import "./NodeLevels.css";

function NodeLevels(props) {
  const { isNodeSelected, nodeLevels } = props;
  return (
    <React.Fragment>
      <h3>
        <FontAwesomeIcon icon={faSitemap} className="header-icon" /> Node Levels
      </h3>
      <div className="node-level-container">
        {isNodeSelected && (
          <Annotation annotationText={"make a node selection"} />
        )}
        {nodeLevels.map((d, i) => {
          return (
            <div className="node-level" key={i}>
              <Spacer amount={(i + 1) * 5} />
              <span className="node-highlight">{d}</span>{" "}
              <FontAwesomeIcon icon={faChevronRight} />
            </div>
          );
        })}
      </div>
      <Divider />
    </React.Fragment>
  );
}

export default NodeLevels;
