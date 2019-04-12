/* eslint-disable react/prop-types */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { maxBy, head, get } from "lodash";
import {
  white,
  pointColor,
  dropZoneTitleColor,
  secondaryTextColor,
  green,
  yellow1,
  notStarted,
  darkGrey,
  incorrect,
  blue
} from "@edulastic/colors";
import { ComposedChart, Bar, Line, XAxis, YAxis, ResponsiveContainer, Rectangle, Tooltip } from "recharts";
import { MainDiv, TooltipContainer } from "./styled";

const RectangleBar = ({ fill, x, y, width, height, dataKey, payload }) => {
  let radius = [10, 10, 0, 0];
  switch (dataKey) {
    case "green":
      if (payload.yellow || payload.lightGrey || payload.red || payload.darkGrey) {
        radius = null;
      }
      break;
    case "yellow":
      if (payload.lightGrey || payload.red || payload.darkGrey) {
        radius = null;
      }
      break;
    case "lightGrey":
      if (payload.red || payload.darkGrey) {
        radius = null;
      }
      break;
    case "darkGrey":
      if (!payload.red) {
        radius = null;
      }
      break;
    default:
      break;
  }
  return <Rectangle x={x} y={y} width={width} height={height} fill={fill} radius={radius} />;
};

const CustomizedTick = ({ payload, x, y, left, index, maxValue, pointValue }) => {
  const isPoint = payload.value % pointValue === 0;
  const x2 = left ? x + 10 : x - 10;
  const textX2 = left ? x - 10 : x + 10;
  const isLastPoint = index + 1 === maxValue;
  return (
    <g>
      {(isLastPoint || isPoint) && <line x1={x} y1={y} x2={x2} y2={y} style={{ stroke: pointColor, strokeWidth: 2 }} />}
      {(isLastPoint || isPoint) && (
        <text x={textX2} y={y} textAnchor="middle" fill={dropZoneTitleColor} alignmentBaseline="middle" fontSize="10">
          {payload.value}
        </text>
      )}
    </g>
  );
};

const CustomTooltip = ({ label, payload }) => {
  const firstItem = head(payload) || {};
  const timeSpent = get(firstItem, "payload.avgTimeSpent");
  return <TooltipContainer title={label}>{`Time(seconds): ${timeSpent}`}</TooltipContainer>;
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
          red: item.wrongNum !== 0 && !item.skippedNum && !item.notStartedNum ? item.wrongNum : 0,
          all: (item.wrongNum || 0) + (item.correctNum || 0) + (item.partialNum || 0) + (item.notStartedNum || 0),
          darkGrey: item.wrongNum === item.attemptsNum && item.skippedNum !== 0 ? item.attemptsNum : 0,
          lightGrey: item.notStartedNum !== 0 ? item.notStartedNum : 0,
          avgTimeSpent: item.avgTimeSpent
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
              tick={{ fontSize: "10px", strokeWidth: 2, fill: secondaryTextColor }}
              padding={{ left: 20, right: 20 }}
            />
            <YAxis
              dataKey="all"
              yAxisId={0}
              allowDecimals={false}
              label={{ value: "ATTEMPTS", angle: -90, fill: dropZoneTitleColor, fontSize: "10px" }}
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
                fill: dropZoneTitleColor,
                fontSize: "10px"
              }}
              axisLine={false}
              tickCount={maxValue}
              tick={props => <CustomizedTick {...props} pointValue={pointValue} maxValue={maxValue} />}
              tickFormatter={() => ""}
              orientation="right"
            />
            <Bar
              stackId="a"
              dataKey="green"
              fill={green}
              shape={<RectangleBar dataKey="green" />}
              onClick={this.handleClick}
            />
            <Bar
              stackId="a"
              dataKey="yellow"
              fill={yellow1}
              shape={<RectangleBar dataKey="yellow" />}
              onClick={this.handleClick}
            />
            <Bar
              stackId="a"
              dataKey="lightGrey"
              fill={notStarted}
              shape={<RectangleBar dataKey="lightGrey" />}
              onClick={this.handleClick}
            />
            <Bar
              stackId="a"
              dataKey="darkGrey"
              fill={darkGrey}
              shape={<RectangleBar dataKey="darkGrey" />}
              onClick={this.handleClick}
            />
            <Bar
              stackId="a"
              dataKey="red"
              fill={incorrect}
              shape={<RectangleBar dataKey="red" />}
              onClick={this.handleClick}
            />
            <Line
              dataKey="green"
              stroke={blue}
              strokeWidth="3"
              type="monotone"
              dot={{ stroke: white, strokeWidth: 6, fill: white }}
            />
            <Tooltip content={<CustomTooltip />} cursor={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </MainDiv>
    );
  }
}
