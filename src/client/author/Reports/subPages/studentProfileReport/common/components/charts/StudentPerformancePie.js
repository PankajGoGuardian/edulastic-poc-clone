import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import next from "immer";
import { round, includes, map } from "lodash";
import { PieChart, Pie, Cell, Tooltip, Label, ResponsiveContainer } from "recharts";
import { themeColorLighter, title as pieTitle } from "@edulastic/colors";
import { getStudentPerformancePieData, getOverallMasteryPercentage, getMaxScale } from "../../utils/transformers";
import { StyledCustomChartTooltip as CustomChartTooltip } from "../../../../../common/styled";
import ScaleInfoLabels from "./ScaleInfoLabels";

const fillColors = (data, selectedMastery) => {
  if (!selectedMastery.length) {
    return data;
  }

  return map(data, item =>
    next(item, draftItem => {
      draftItem.color = includes(selectedMastery, item.masteryLabel) ? item.color : "#cccccc";
    })
  );
};

const renderCustomizedInnerLabel = props => {
  const {
    masteryPercentage,
    viewBox: { cx, cy }
  } = props;

  return (
    <>
      <StyledText
        x={cx}
        y={cy - 8}
        fill={themeColorLighter}
        textAnchor="middle"
        dominantBaseline="central"
        customFont="35px/47px Open Sans"
      >
        {masteryPercentage}%
      </StyledText>
      <StyledText
        x={cx}
        y={cy + 18}
        textAnchor="middle"
        dominantBaseline="central"
        customFont="11px/15px Open Sans"
        weight={600}
        spacing="0.2px"
      >
        IN MASTERY
      </StyledText>
    </>
  );
};

const getPercentageScaleMap = itemsArray =>
  itemsArray.reduce((res, ele) => {
    res[ele.masteryLabel] = ele.percentage;
    return res;
  }, {});

const StudentPerformancePie = ({ data, scaleInfo, onSectionClick, selectedMastery, getTooltip, title }) => {
  // process data to fill and label the pie chart
  const pieData = getStudentPerformancePieData(data, scaleInfo);
  const maxScale = getMaxScale(scaleInfo);
  const overallMasteryPercentage = getOverallMasteryPercentage(data, maxScale);
  const dataWithColors = fillColors(pieData, selectedMastery);

  // process pieData to get percentage scale info for ScaleInfoLabels
  const scaleMap = getPercentageScaleMap(pieData);
  const scaleMapKeys = Object.keys(scaleMap);
  const percentageScaleInfo = (scaleInfo || []).map(item => {
    item.percentage = scaleMapKeys.includes(item.masteryLabel) ? scaleMap[item.masteryLabel] : 0;
    return item;
  });

  return (
    <>
      <StyledTitle>{title}</StyledTitle>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart width={100} height={100}>
          <Tooltip cursor={false} content={<StyledCustomChartTooltip getJSX={getTooltip} />} />
          <Pie
            data={pieData}
            labelLine={false}
            outerRadius={75}
            innerRadius={53}
            fill="#8884d8"
            dataKey="count"
            onClick={onSectionClick}
          >
            <Label
              position="center"
              content={renderCustomizedInnerLabel}
              masteryPercentage={round(overallMasteryPercentage)}
            />
            {dataWithColors.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <ScaleInfoLabels scaleInfo={percentageScaleInfo} />
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
  title: "MASTERY OF ASSESSED"
};

export default StudentPerformancePie;

const StyledCustomChartTooltip = styled(CustomChartTooltip)`
  min-width: 70px;
  min-height: auto;
`;

const StyledTitle = styled.span`
  display: block;
  text-align: center;
  font: Bold 14px/19px Open Sans;
  letter-spacing: 0;
  color: ${pieTitle};
`;

const StyledText = styled.text`
  text-align: center;
  font: ${props => props.customFont};
  font-weight: ${props => props.weight || "bold"};
  letter-spacing: ${props => props.spacing || "0px"};
`;
