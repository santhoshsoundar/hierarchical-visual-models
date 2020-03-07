import React from "react";
import "./HeaderComponent.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCodeBranch } from "@fortawesome/free-solid-svg-icons";

function HeaderComponent() {
  return (
    <header className="App-header">
      <h2>Hierarchical Visual Models</h2>
      <a
        href={"https://github.com/santhoshsoundar/hierarchical-visual-models"}
        target="_blank"
        rel="noopener noreferrer"
        className="git-link"
      >
        [<FontAwesomeIcon icon={faCodeBranch} />]
      </a>
      <span className="header-secondary"> an alternative approach </span>
      <p className="header-content">
        This is a hierarchical tree representation of POI sequence A3
        Destination data, that had its own unique character of having ~[10-20]
        nodes or leafs with multi level leaf metrics(size). So with the
        following hierarchical tree implements few different levels of
        abstraction to slice and dice the given data maintaining hierarchy. This
        is achieved with the help of user interactions with the tree nodes
        coupled with breakdown of corresponding data and depth of nodes. <br />
        Other displays of hierarchical structures such as a Sunburst has its own
        set of chalenges such as: [1] <i>Labels, very hard to represent</i>. [2]{" "}
        <i>Angles are hard to read</i>. [3]{" "}
        <i>Deeper slices are exagerated compared to inner levels</i>.
      </p>
    </header>
  );
}

export default HeaderComponent;
