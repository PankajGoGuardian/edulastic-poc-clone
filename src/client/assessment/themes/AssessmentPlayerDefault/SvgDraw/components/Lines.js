import React from "react";
import cloneDeep from "lodash/cloneDeep";
import styled from "styled-components";
import { getPointsForDrawingPath } from "../utils";

const Lines = ({ pathes, deleteMode, disableRemove, saveHistory }) => {
  const handleDeletePath = index => () => {
    if (disableRemove(index, "pathes")) return;
    const newPathes = cloneDeep(pathes);
    newPathes.splice(index, 1);
    saveHistory({ pathes: newPathes, points: [] });
  };

  return (
    pathes.length > 0 &&
    pathes.map(
      (path, i) =>
        path.length && (
          <Path
            key={i}
            onClick={deleteMode ? handleDeletePath(i) : undefined}
            stroke={path[0].color}
            strokeWidth={path[0].lineWidth}
            d={getPointsForDrawingPath(path)}
          />
        )
    )
  );
};

export default Lines;

const Path = styled.path`
  stroke-linecap: round;
  fill: none;
  stroke-linejoin: round;
`;
