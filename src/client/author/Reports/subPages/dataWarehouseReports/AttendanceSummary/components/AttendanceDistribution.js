import React, { useState } from 'react'
import { PieChart, Pie, Sector, ResponsiveContainer, Cell } from 'recharts';
import styled from 'styled-components'

const data = [
  { name: 'Satisfactory', value: 64, id: 1, color: "#73C578" },
  { name: 'Extreme Chronic', value: 12, id: 2, color: "#FBBC04" },
  { name: 'Moderate Chronic', value: 12, id: 3, color: "#FF6D01" },
  { name: 'At-risk', value: 12, id: 4, color: "#EA4335" },
];

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
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
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`${value}%`}
      </text>
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      
    </g>
  );
};


const AttendanceDistribution = (props) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const onPieEnter = (_, index) => {
    setActiveIndex(index)
  };

  return (
    <PieWrapper>
      <Title>Attendance Distribution</Title>
      <PieChart width={432} height={432}>
        <Pie
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={80}
          outerRadius={110}
          fill="#8884d8"
          dataKey="value"
          onMouseEnter={onPieEnter}
        >
          {data.map((entry) => (
            <Cell key={`cell-${entry.id}`} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
      <LegendWrap>
        {data.map(entry=> {
          return (
            <CustomLegend>
              <LegendSymbol color={entry.color}/> 
              <LegendName>{entry.name}</LegendName>
            </CustomLegend>
          )
        })}
      </LegendWrap>
    </PieWrapper>
  );
}

AttendanceDistribution.propTypes = {
}

AttendanceDistribution.defaultProps = {
}

export default AttendanceDistribution

export const Title = styled.div`
  font-size: 16px;
  color: #434B5D;
  width: 100%;
  font-weight: bold;
`
export const PieWrapper = styled.div`
  border: 1px solid #dedede;
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 465px;
  border-radius: 10px;
  padding: 24px;
`

export const LegendWrap = styled.div`
  display: flex;
  align-items:center;
  justify-content: column;
`

export const CustomLegend = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  margin-right: 10px;
`

export const LegendSymbol = styled.span`
  width: 10px;
  height: 10px;
  background: ${props=> props.color};
  display: flex;
  border-radius: 50%;
  margin-right: 10px;
`

export const LegendName = styled.span`
  font-size: 11px;
  color: #4B4B4B;
`