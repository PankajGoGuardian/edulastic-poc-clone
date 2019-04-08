import React, { Component } from "react";
import PropTypes from "prop-types";
import { maxBy } from "lodash";
import { white } from "@edulastic/colors";
import { ComposedChart, Bar, Line, XAxis, YAxis, ResponsiveContainer, Rectangle } from "recharts";
import { MainDiv } from "./styled";

// eslint-disable-next-line react/prop-types
const RectangleBar = ({ fill, x, y, width, height }) => (
  <Rectangle x={x} y={y} width={width} height={height} fill={fill} radius={[10, 10, 0, 0]} />
);

// eslint-disable-next-line react/prop-types
const CustomizedTick = ({ payload, x, y, left, index, maxValue, pointValue }) => {
  const isPoint = payload.value % pointValue === 0;
  const x2 = left ? x + 10 : x - 10;
  const textX2 = left ? x - 10 : x + 10;
  const isLastPoint = index + 1 === maxValue;
  return (
    <g>
      {(isLastPoint || isPoint) && <line x1={x} y1={y} x2={x2} y2={y} style={{ stroke: "#4a4a4a", strokeWidth: 2 }} />}
      {(isLastPoint || isPoint) && (
        <text x={textX2} y={y} textAnchor="middle" fill="#B1B1B1" alignmentBaseline="middle" fontSize="10">
          {payload.value}
        </text>
      )}
    </g>
  );
};

export default class BarGraph extends Component {
  static propTypes = {
    gradebook: PropTypes.object.isRequired,
    onClickHandler: PropTypes.func.isRequired,
    children: PropTypes.node
  };

  static defaultProps = {
    children: null
  };

  isMobile = () => window.innerWidth < 480;

  handleClick = (data, index) => {
    const { onClickHandler } = this.props;
    if (onClickHandler) {
      onClickHandler(index);
    }
  };

  render() {
    const { gradebook, children } = this.props;
    const itemsSum = gradebook.itemsSummary;
    const isMobile = this.isMobile();
    let data = [];
    if (itemsSum) {
      data = itemsSum
        .map((item, index) => ({
          name: `Q${index + 1}`,
          green: item.correctNum !== 0 ? item.correctNum : 0,
          yellow: item.partialNum !== 0 ? item.partialNum : 0,
          red: item.wrongNum !== 0 && !item.skippedNum ? item.wrongNum : 0,
          all: (item.wrongNum || 0) + (item.correctNum || 0) + (item.partialNum || 0),
          darkGrey: item.wrongNum === item.attemptsNum && item.skippedNum !== 0 ? item.attemptsNum : 0,
          lightGrey: item.wrongNum !== item.attemptsNum && item.skippedNum !== 0 ? item.skippedNum : 0
        }))
        .slice(0, 15);
    }
    const maxItem = maxBy(data, d => d.all) || {};
    const maxValue = (maxItem.all || 0) + 2;
    let pointValue = 2;
    if (maxValue > 10) {
      pointValue = 10;
    } else if (maxValue > 5 && maxValue < 10) {
      pointValue = 5;
    } else {
      pointValue = 1;
    }

    if (isMobile) {
      data = data.slice(0, 2);
    }

    return (
      <MainDiv className="studentBarChart">
        {children}
        <ResponsiveContainer width="100%" height={240}>
          <ComposedChart barGap={1} barSize={36} data={data}>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickSize={0}
              dy={8}
              tick={{ fontSize: "10px", strokeWidth: 2, fill: "#434b5d" }}
              padding={{ left: 20, right: 20 }}
            />
            <YAxis
              dataKey="all"
              yAxisId={0}
              allowDecimals={false}
              label={{ value: "ATTEMPTS", angle: -90, fill: "#b1b1b1", fontSize: "10px" }}
              axisLine={false}
              tickCount={maxValue}
              tick={props => <CustomizedTick left {...props} pointValue={pointValue} maxValue={maxValue} />}
              tickFormatter={() => ""}
            />
            <YAxis
              dataKey="all"
              yAxisId={1}
              allowDecimals={false}
              label={{
                value: "AVG TIME (SECONDS)",
                angle: -90,
                fill: "#b1b1b1",
                fontSize: "10px"
              }}
              axisLine={false}
              tickCount={maxValue}
              tick={props => <CustomizedTick {...props} pointValue={pointValue} maxValue={maxValue} />}
              tickFormatter={() => ""}
              orientation="right"
            />
            <Bar stackId="a" dataKey="green" fill="#1FE3A1" onClick={this.handleClick} />
            <Bar stackId="a" dataKey="yellow" fill="#FDCC3B" onClick={this.handleClick} />
            <Bar stackId="a" dataKey="red" fill="#F35F5F" shape={<RectangleBar />} onClick={this.handleClick} />
            <Bar stackId="a" dataKey="lightGrey" fill="#f5f5f5" onClick={this.handleClick} />
            <Bar stackId="a" dataKey="darkGrey" fill="#e5e5e5" onClick={this.handleClick} />
            <Line
              dataKey="green"
              stroke="#1774F0"
              strokeWidth="3"
              type="monotone"
              dot={{ stroke: white, strokeWidth: 6, fill: white }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </MainDiv>
    );
  }
}
