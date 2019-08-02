import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import next from "immer";
import { round, includes, map } from "lodash";
import { PieChart, Pie, Cell, Tooltip, Label, ResponsiveContainer } from "recharts";
import { getStudentPerformancePieData, getOverallMasteryPercentage, getMaxScale } from "../../utils/transformers";
import { StyledCustomChartTooltip as CustomChartTooltip, StyledH3 } from "../../../../../common/styled";
import BarTooltipRow from "../../../../../common/components/tooltip/BarTooltipRow";

const fillColors = (data, selectedMastery) => {
  if (!selectedMastery.length) {
    return data;
  }

  return map(data, item => {
    return next(item, draftItem => {
      draftItem.color = includes(selectedMastery, item.masteryLabel) ? item.color : "#cccccc";
    });
  });
};

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

const StudentPerformancePie = ({ data, scaleInfo, onSectionClick, selectedMastery, getTooltip, title }) => {
  const pieData = getStudentPerformancePieData(data, scaleInfo);
  const maxScale = getMaxScale(scaleInfo);
  const overallMasteryPercentage = getOverallMasteryPercentage(data, maxScale);

  const dataWithColors = fillColors(pieData, selectedMastery);

  return (
    <>
      <StyledH3>{title}</StyledH3>
      <ResponsiveContainer width={"100%"} height={400}>
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
            onClick={onSectionClick}
          >
            <Label value={`Mastery ${round(overallMasteryPercentage)}%`} position="center" />
            {dataWithColors.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </>
  );
};

StudentPerformancePie.propTypes = {
  data: PropTypes.array.isRequired,
  scaleInfo: PropTypes.array.isRequired,
  title: PropTypes.string,
  onSectionClick: PropTypes.func,
  selectedMastery: PropTypes.array,
  getTooltip: PropTypes.func
};

StudentPerformancePie.defaultProps = {
  onSectionClick: () => {},
  getTooltip: () => null,
  selectedMastery: [],
  title: "Overall Mastery"
};

export default StudentPerformancePie;

const StyledCustomChartTooltip = styled(CustomChartTooltip)`
  min-width: 70px;
  min-height: auto;
`;
