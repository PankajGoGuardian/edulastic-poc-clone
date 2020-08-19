import React, { useState } from "react";
import { PieChart, Pie, Cell } from "recharts";
import { themeColorLight1, lightGrey8, darkRed1 } from "@edulastic/colors/index";

const Circles = ({
  sectors,
  selected,
  sectorClick,
  fractionNumber,
  previewTab,
  evaluation,
  isExpressGrader,
  isAnswerModifiable
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

  const radius = 150;

  return (
    <PieChart width={radius * 2 + 10} height={radius * 2 + 10}>
      <Pie data={_sectors} cx={radius} cy={radius} outerRadius={radius} dataKey="value">
        {_sectors.map(sector => {
          const hoverProps = {};
          let fillColor = lightGrey8;
          const _selected = selected.includes(sector.index);
          if (previewTab === "edit" || previewTab === "clear") {
            // edit mode as well as clear
            fillColor = _selected ? themeColorLight1 : lightGrey8;
          } else if (_selected) {
            // show answers with highlighting (correct: green, wrong: darkRed)
            fillColor = evaluation
              ? evaluation[sector.index] === true
                ? themeColorLight1
                : darkRed1
              : themeColorLight1;
          }
          if (isExpressGrader && isAnswerModifiable && _selected) {
            // in expressGrader and edit response is on
            // override default highlighting with darkBlue color when selected
            fillColor = themeColorLight1;
          }

          if (previewTab === "clear") {
            hoverProps.onMouseEnter = () => onHover(sector.index);
            hoverProps.onMouseLeave = () => handleSectorBlur(sector.index);
            if (hovered === sector.index) {
              fillColor = themeColorLight1;
            }
          }
          return (
            <Cell
              {...hoverProps}
              onClick={() => {
                sectorClick(sector.index);
                if (_selected) {
                  handleSectorBlur(sector.index);
                }
              }}
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
