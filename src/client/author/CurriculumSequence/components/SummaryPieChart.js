import React, { useState } from "react";
import moment from "moment";
import { themeColorLighter, greyThemeDark1, titleColor } from "@edulastic/colors";
import { PieChart, Pie, Sector, Cell } from "recharts";
import { StyledProgressDiv, StyledProgress, GraphDescription } from "../../ClassBoard/components/ProgressGraph/styled";

const renderActiveShape = props => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    tSpent = 0,
    totalTimeSpent = 0,
    showTotalTime
  } = props;

  const getFormattedTime = timeInMillis => {
    const duration = moment.duration(timeInMillis);
    let minutes = duration.minutes();
    const hours = duration.hours();
    const seconds = duration.seconds();
    // To make it consistent with module level time spent
    if (seconds > 50) {
      minutes += 1;
    }
    return [`${hours} hr`, `${minutes} MINS`];
  };

  const formattedTime = showTotalTime ? getFormattedTime(totalTimeSpent) : getFormattedTime(tSpent);

  return (
    <g>
      <text x={cx} y={cy} dy={5} font-size="30" font-weight="bold" textAnchor="middle" color={titleColor}>
        {formattedTime[0]}
      </text>
      <text x={cx} y={cy} dy={22} font-size="13" textAnchor="middle" color={greyThemeDark1}>
        {formattedTime[1]}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

const SummaryPieChart = ({ data = [], totalTimeSpent, colors, isStudent }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showTotalTime, setDefaultTimeSpent] = useState(true);

  const onPieEnter = (data, index) => {
    setDefaultTimeSpent(false);
    setActiveIndex(index);
  };

  let maxSliceIndex = 0,
    chartData = data?.filter(ele => ele?.tSpent !== 0 && !(ele?.hidden && isStudent));

  // find maxSliceIndex and set value = tSpent
  chartData = chartData?.map((ele, idx) => {
    if (ele.tSpent > chartData[maxSliceIndex].tSpent) {
      maxSliceIndex = idx;
    }
    return { ...ele, value: ele?.tSpent };
  });

  return chartData.length ? (
    <PieChart width={315} height={250}>
      <Pie
        activeIndex={activeIndex}
        activeShape={props => renderActiveShape({ ...props, showTotalTime, totalTimeSpent })}
        data={chartData}
        cx={150}
        cy={130}
        innerRadius={50}
        outerRadius={68}
        label={({ name }) => name}
        isAnimationActive={false} // Tradeoff: to show labels -  https://github.com/recharts/recharts/issues/929
        onMouseEnter={onPieEnter}
        onMouseLeave={() => setDefaultTimeSpent(true)}
        showTotalTime={showTotalTime}
      >
        {chartData?.map((m, dataIndex) => (
          <Cell fill={dataIndex === maxSliceIndex ? themeColorLighter : colors[m.index % colors.length]} />
        ))}
      </Pie>
    </PieChart>
  ) : (
    <StyledProgressDiv>
      <StyledProgress
        className="noProgress"
        strokeLinecap="square"
        type="circle"
        percent={10}
        width={140}
        strokeWidth={13}
        strokeColor="#aaaaaa"
        trailColor="#aaaaaa"
        margin="60px 0px 40px 0px"
        textColor={titleColor}
        textSize="30px"
        format={() => `0 hr`}
      />
      <GraphDescription size="13px" color={greyThemeDark1}>
        0 MINS
      </GraphDescription>
    </StyledProgressDiv>
  );
};
export default SummaryPieChart;
