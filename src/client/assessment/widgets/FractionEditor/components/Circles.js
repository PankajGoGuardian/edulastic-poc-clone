import React, { useState } from "react";
import { PieChart, Pie, Cell } from "recharts";
import { mainBlueColor, lightBlue } from "@edulastic/colors/index";

const Circles = ({ sectors, selected, sectorClick, fractionNumber }) => {
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
          const fillColor = hovered === sector.index || selected.includes(sector.index) ? mainBlueColor : lightBlue;
          return (
            <Cell
              onMouseEnter={() => onHover(sector.index)}
              onMouseLeave={() => handleSectorBlur(sector.index)}
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
