import React from "react";
import styled from "styled-components";

import { getPointsForDrawingPath } from "../utils";

const Points = ({ points, deleteMode, disableRemove, saveHistory }) => {
  const handleClearPoints = () => {
    if (disableRemove()) return;
    saveHistory({ points: [] });
  };
  return (
    points.length > 0 && (
      <Path
        stroke={points[0].color}
        onClick={deleteMode ? handleClearPoints : undefined}
        strokeWidth={points[0].lineWidth}
        d={getPointsForDrawingPath(points)}
      />
    )
  );
};
export default Points;

const Path = styled.path`
  stroke-linecap: round;
  fill: none;
  stroke-linejoin: round;
`;
