import React from "react";
import { Rectangle } from "recharts";
import { last } from "lodash";
import { bars } from "./helpers";

const CustomBar = ({ fill, x, y, width, height, dataKey, ...rest }) => {
  let radius = [5, 5, 0, 0];
  const availableBars = Object.keys(bars)
    .map(key => (rest[key] !== 0 ? key : false))
    .filter(em => em);

  if (dataKey !== last(availableBars)) {
    radius = null;
  }
  return <Rectangle x={x} y={y} width={width} height={height} fill={fill} radius={radius} />;
};

export default CustomBar;
