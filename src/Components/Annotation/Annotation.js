import React from "react";
import "./Annotation.css";

function Annotation(props) {
  const { annotationText } = props;
  return <div className="annotation">{annotationText}</div>;
}

export default Annotation;
