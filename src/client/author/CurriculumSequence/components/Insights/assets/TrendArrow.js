import React from "react";

const TrendArrow = ({ cx = 0, cy = 0, color, trendAngle = 0, transformOrigin = "inherit" }) => (
  <g
    transform={`translate(${cx} ${cy}) rotate(${-trendAngle - 90})`}
    transform-origin={transformOrigin}
    pointerEvents="bounding-box"
  >
    <path d="M0,0V18.385" transform="translate(4.065 3.536)" fill="none" stroke={color} strokeWidth="2" />
    <g transform="translate(7.565 26.438) rotate(180)" fill={color}>
      <path
        d="M 6.129451751708984 5.499964714050293 L 0.8705185651779175 5.499964714050293 L 3.499985218048096 0.9923245310783386 L 6.129451751708984 5.499964714050293 Z"
        stroke="none"
      />
      <path
        d="M 3.499985218048096 1.984634399414062 L 1.741035938262939 4.999964714050293 L 5.258934497833252 4.999964714050293 L 3.499985218048096 1.984634399414062 M 3.499985218048096 4.291534423828125e-06 L 6.999975204467773 5.999964714050293 L -4.76837158203125e-06 5.999964714050293 L 3.499985218048096 4.291534423828125e-06 Z"
        stroke="none"
        fill={color}
      />
    </g>
    <path d="M3,0A3,3,0,1,1,0,3,3,3,0,0,1,3,0Z" transform="translate(8.485 4.243) rotate(135)" fill={color} />
  </g>
);

export default TrendArrow;
