import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { round } from "lodash";
import { PieChart, Pie, Cell, Tooltip, Label } from "recharts";
import { getStudentPerformancePieData, getOverallMasteryPercentage, getMaxScale } from "../../utils/transformers";
import { StyledCustomChartTooltip as CustomChartTooltip, StyledH3 } from "../../../../../../common/styled";
import BarTooltipRow from "../../../../../../common/components/tooltip/BarTooltipRow";

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, masteryLabel }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="black" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
      {masteryLabel}
    </text>
  );
};
const getTooltip = payload => {
  if (payload && payload.length) {
    const { masteryName = "", percentage = 0 } = payload[0].payload;
    return (
      <div>
        <BarTooltipRow title={`${masteryName} : `} value={`${percentage}%`} />
      </div>
    );
  }
  return false;
};

const StudentPerformancePie = ({ data, scaleInfo }) => {
  const pieData = getStudentPerformancePieData(data, scaleInfo);
  const maxScale = getMaxScale(scaleInfo);
  const overallMasteryPercentage = getOverallMasteryPercentage(data, maxScale);

  return (
    <>
      <StyledH3>Overall Mastery</StyledH3>
      <PieChart width={400} height={400}>
        <Tooltip cursor={false} content={<StyledCustomChartTooltip getJSX={getTooltip} />} />
        <Pie
          data={pieData}
          labelLine={false}
          outerRadius={150}
          innerRadius={50}
          cx={175}
          cy={200}
          fill="#8884d8"
          dataKey="count"
          label={renderCustomizedLabel}
          onClick={(...args) => console.log(args)}
        >
          <Label value={`Mastery ${round(overallMasteryPercentage)}%`} position="center" />
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
    </>
  );
};

StudentPerformancePie.propTypes = {
  data: PropTypes.array.isRequired,
  scaleInfo: PropTypes.array.isRequired
};

export default StudentPerformancePie;

const StyledCustomChartTooltip = styled(CustomChartTooltip)`
  min-width: 70px;
  min-height: auto;
`;
