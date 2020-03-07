import React from "react";
import "./Annotation.css";

function Annotation(props) {
  const { annotationText } = props;
  return (
    <div className="annotation">
      <p>{annotationText}</p>
    </div>
  );
}

export default Annotation;
