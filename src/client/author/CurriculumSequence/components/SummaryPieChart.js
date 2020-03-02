import React, { useState } from "react";
import moment from "moment";
import { PieChart, Pie, Sector, Cell } from "recharts";

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
    const minutes = duration.minutes();
    const hours = duration.hours();
    return [`${hours} hr`, `${minutes} MINS`];
  };

  const formattedTime = showTotalTime ? getFormattedTime(totalTimeSpent) : getFormattedTime(tSpent);

  return (
    <g>
      <text x={cx} y={cy} dy={5} font-size="30" font-weight="bold" textAnchor="middle">
        {formattedTime[0]}
      </text>
      <text x={cx} y={cy} dy={22} font-size="13" textAnchor="middle">
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

const SummaryPieChart = ({ data = [], totalTimeSpent, colors }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showTotalTime, setDefaultTimeSpent] = useState(true);

  const onPieEnter = (data, index) => {
    setDefaultTimeSpent(false);
    setActiveIndex(index);
  };

  const chartData = data
    ?.filter(x => x?.tSpent !== 0)
    ?.map(x => ({
      ...x,
      value: x?.tSpent
    }));

  return (
    <PieChart width={315} height={250}>
      <Pie
        activeIndex={activeIndex}
        activeShape={props => renderActiveShape({ ...props, showTotalTime, totalTimeSpent })}
        data={chartData}
        cx={150}
        cy={130}
        innerRadius={50}
        outerRadius={65}
        label={({ name }) => name}
        isAnimationActive={false} // Tradeoff: to show labels -  https://github.com/recharts/recharts/issues/929
        onMouseEnter={onPieEnter}
        onMouseLeave={() => setDefaultTimeSpent(true)}
        showTotalTime={showTotalTime}
      >
        {chartData?.map(m => <Cell fill={colors[m.index % colors.length]} />)}
      </Pie>
    </PieChart>
  );
};
export default SummaryPieChart;
