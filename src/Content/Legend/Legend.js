import React from "react";
import "./Legend.css";

function Legend(props) {
  const { labelText, color } = props;
  return (
    <div className="legend-item">
      <svg width={10} height={10} className="marker">
        <circle cx={5} cy={5} r={5} fill={color} />
      </svg>
      {labelText}
    </div>
  );
}

export default Legend;
