import React, { useState } from "react";
import { PieChart, Pie, Cell } from "recharts";
import { mainBlueColor, lightBlue, green, redDark } from "@edulastic/colors/index";

const Circles = ({
  sectors,
  selected,
  sectorClick,
  fractionNumber,
  previewTab,
  evaluation,
  isExpressGrader,
  isAnswerModifiable,
  isReviewTab
}) => {
  const _sectors = [];
  const offset = fractionNumber * sectors;
  const [hovered, setHovered] = useState(-1);

  const onHover = index => {
    setHovered(+index);
  };
  const handleSectorBlur = () => {
    setHovered(-1);
  };
  for (let i = 1; i <= sectors; i++) {
    _sectors.push({ index: i + offset, value: 360 / sectors });
  }

  return (
    <PieChart width={400} height={400}>
      <Pie data={_sectors} cx={200} cy={200} outerRadius={150} dataKey="value">
        {_sectors.map(sector => {
          const hoverProps = {};
          const _selected = selected.includes(sector.index);
          let fillColor;
          if (previewTab === "show") {
            if (isAnswerModifiable && isExpressGrader === undefined) {
              //showAnswer tab and test review page (show userAnswers with green or redDark)
              fillColor = _selected ? green : lightBlue;
            } else if (!isAnswerModifiable && !isExpressGrader) {
              // in LCB (show userAttempted answers as redDark or green)
              if (_selected) {
                fillColor = evaluation ? (evaluation[sector.index] || isReviewTab ? green : redDark) : mainBlueColor;
              } else {
                fillColor = lightBlue;
              }
            } else if (isExpressGrader) {
              if (!isAnswerModifiable) {
                //inExprssGrader and editResponse if false (show userAnswers in greed or redDark)
                if (_selected) {
                  fillColor = evaluation ? (evaluation[sector.index] || isReviewTab ? green : redDark) : mainBlueColor;
                } else {
                  fillColor = lightBlue;
                }
              } else {
                //inExprssGrader and editResponse if true
                fillColor = _selected ? mainBlueColor : lightBlue;
              }
            }
          } else if (previewTab === "check") {
            //checkAnswer tab (show userAttempted answers as redDark or green)
            if (_selected) {
              fillColor = evaluation ? (evaluation[sector.index] ? green : redDark) : mainBlueColor;
            } else {
              fillColor = lightBlue;
            }
          } else {
            //edit mode as well as clear
            fillColor = _selected ? mainBlueColor : lightBlue;
          }

          if (previewTab === "clear") {
            (hoverProps.onMouseEnter = () => onHover(sector.index)),
              (hoverProps.onMouseLeave = () => handleSectorBlur(sector.index));
            if (hovered === sector.index) {
              fillColor = mainBlueColor;
            }
          }
          return (
            <Cell
              {...hoverProps}
              onClick={() => sectorClick(sector.index)}
              key={`cell-${sector.index}`}
              fill={fillColor}
            />
          );
        })}
      </Pie>
    </PieChart>
  );
};
export default Circles;
