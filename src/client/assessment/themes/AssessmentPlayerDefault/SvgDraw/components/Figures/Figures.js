import React, { Fragment } from "react";
import styled from "styled-components";
import { drawTools } from "@edulastic/constants";

const Figures = ({
  figures,
  active,
  activeMode,
  deleteMode,
  onMouseDown,
  onMouseUp,
  onClick,
  mouseUpAndDownControl
}) => {
  const renderFigure = (path, i) =>
    path.x ? (
      <Rect
        key={i}
        onMouseDown={onMouseDown(drawTools.DRAW_SQUARE, i)}
        onTouchStart={onMouseDown(drawTools.DRAW_SQUARE, i)}
        onMouseUp={onMouseUp(drawTools.DRAW_SQUARE, i)}
        onTouchEnd={onMouseUp(drawTools.DRAW_SQUARE, i)}
        onClick={onClick(drawTools.DRAW_SQUARE, i)}
        {...path}
      />
    ) : path.points ? (
      <Polygon
        key={i}
        onMouseDown={onMouseDown(drawTools.DRAW_TRIANGLE, i)}
        onTouchStart={onMouseDown(drawTools.DRAW_TRIANGLE, i)}
        onMouseUp={onMouseUp(drawTools.DRAW_TRIANGLE, i)}
        onTouchEnd={onMouseUp(drawTools.DRAW_TRIANGLE, i)}
        onClick={onClick(drawTools.DRAW_TRIANGLE, i)}
        {...path}
      />
    ) : (
      <Ellipse
        key={i}
        onMouseDown={onMouseDown(drawTools.DRAW_CIRCLE, i)}
        onTouchStart={onMouseDown(drawTools.DRAW_CIRCLE, i)}
        onMouseUp={onMouseUp(drawTools.DRAW_CIRCLE, i)}
        onTouchEnd={onMouseUp(drawTools.DRAW_CIRCLE, i)}
        onClick={onClick(drawTools.DRAW_CIRCLE, i)}
        {...path}
      />
    );

  const renderActiveFigure = () => {
    let rects;
    if (!figures[active].cx && !figures[active].points) {
      rects = [
        { x: figures[active].x - 10, y: figures[active].y - 10 },
        {
          x: figures[active].x + figures[active].width - 10,
          y: figures[active].y - 10
        },
        {
          x: figures[active].x + figures[active].width - 10,
          y: figures[active].y + figures[active].height - 10
        },
        {
          x: figures[active].x - 10,
          y: figures[active].y + figures[active].height - 10
        }
      ];
    } else if (figures[active].cx !== undefined) {
      rects = [
        {
          x: figures[active].cx - figures[active].rx - 10,
          y: figures[active].cy - figures[active].ry - 10
        },
        {
          x: figures[active].cx + figures[active].rx - 10,
          y: figures[active].cy - figures[active].ry - 10
        },
        {
          x: figures[active].cx + figures[active].rx - 10,
          y: figures[active].cy + figures[active].ry - 10
        },
        {
          x: figures[active].cx - figures[active].rx - 10,
          y: figures[active].cy + figures[active].ry - 10
        }
      ];
    } else {
      rects = figures[active].points.split(" ").map(item => {
        const point = item.split(",");
        return { x: point[0] - 10, y: point[1] - 10 };
      });
    }
    return (
      <Fragment>
        <polygon
          points={rects.map(point => `${point.x + 10},${point.y + 10}`).join(" ")}
          fill="none"
          stroke="black"
          style={{ strokDashoffset: 0, strokeDasharray: 5 }}
        />
        {renderFigure(figures[active], active)}
        {rects.map((point, i) => (
          <Rect
            key={i}
            onMouseDown={mouseUpAndDownControl(true, i)}
            onTouchStart={mouseUpAndDownControl(true, i)}
            onMouseUp={mouseUpAndDownControl(false)}
            onTouchEnd={mouseUpAndDownControl(false)}
            fill="blue"
            {...point}
            height={20}
            width={20}
          />
        ))}
      </Fragment>
    );
  };

  return [
    active !== null &&
      figures[active] &&
      !deleteMode &&
      activeMode !== drawTools.DRAW_TEXT &&
      activeMode !== drawTools.DRAW_MATH && <Fragment>{renderActiveFigure()}</Fragment>,
    figures.length > 0 &&
      figures.map((path, i) => {
        if (i !== active || activeMode === drawTools.DRAW_MATH || activeMode === drawTools.DRAW_TEXT) {
          return renderFigure(path, i);
        }
        return false;
      })
  ];
};

export default Figures;

const Polygon = styled.polygon`
  stroke-linecap: round;
  stroke-linejoin: round;
`;

const Ellipse = styled.ellipse`
  stroke-linecap: round;
  stroke-linejoin: round;
`;

const Rect = styled.rect`
  stroke-linecap: round;
  stroke-linejoin: round;
`;
