import React from "react";
import "./Legend.css";

export function Legend(props) {
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

export function LegendLink(props) {
  const { linkWidth } = props,
    legendLinkStyle = { fill: "#444", rx: "5", opacity: 0.3 };
  return (
    <svg width="330" height="28">
      <g>
        <rect
          x="20"
          y={15 - linkWidth(6000) / 2}
          width="40"
          height={linkWidth(6000)}
          style={legendLinkStyle}
        />
        <text x="65" dy="1.6em" style={{ fontSize: "12px" }}>
          6000
        </text>
        <rect
          x="110"
          y={15 - linkWidth(100) / 2}
          width="40"
          height={linkWidth(100)}
          style={legendLinkStyle}
        />
        <text x="155" dy="1.6em" style={{ fontSize: "12px" }}>
          100
        </text>
        <rect
          x="190"
          y={15 - linkWidth(25) / 2}
          width="40"
          height={linkWidth(25)}
          style={legendLinkStyle}
        />
        <text x="235" dy="1.6em" style={{ fontSize: "12px" }}>
          50
        </text>
        <rect
          x="260"
          y={15 - linkWidth(5) / 2}
          width="40"
          height={linkWidth(5)}
          style={legendLinkStyle}
        />
        <text x="305" dy="1.6em" style={{ fontSize: "12px" }}>
          5
        </text>
      </g>
    </svg>
  );
}
