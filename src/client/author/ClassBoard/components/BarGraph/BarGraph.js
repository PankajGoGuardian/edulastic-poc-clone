/* eslint-disable react/prop-types */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { get, groupBy } from "lodash";
import { ticks } from "d3-array";
import {
  white,
  pointColor,
  dropZoneTitleColor,
  secondaryTextColor,
  green,
  incorrect,
  blue,
  yellow
} from "@edulastic/colors";
import { ComposedChart, Bar, Line, XAxis, YAxis, ResponsiveContainer, Rectangle, Tooltip } from "recharts";
import { MainDiv, StyledCustomTooltip } from "./styled";
import { StyledChartNavButton } from "../../../Reports/common/styled";
import { getAggregateByQuestion } from "../../ducks";
import memoizeOne from "memoize-one";

const _getAggregateByQuestion = memoizeOne(getAggregateByQuestion);

const RectangleBar = ({ fill, x, y, width, height, dataKey, incorrectAttemps }) => {
  let radius = [5, 5, 0, 0];
  if (dataKey === "correctAttemps" && incorrectAttemps !== 0) {
    radius = null;
  }

  return <Rectangle x={x} y={y} width={width} height={height} fill={fill} radius={radius} />;
};

// eslint-disable-next-line no-unused-vars
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
          {Math.round(payload.value / 1000)}
        </text>
      )}
    </g>
  );
};

export default class BarGraph extends Component {
  isMobile = () => window.innerWidth < 480;

  constructor(props) {
    super(props);
    let page = props.pageSize || 20;
    if (this.isMobile()) {
      page = 5;
    }

    // README: When I was fixing the chart, I found no use case of "children". It was
    // already there. I didn't remove it since there might be some use case which I dont know about
    // Later it should be removed if it has no use case.

    this.state = {
      page,
      chartData: [],
      renderData: [],
      maxAttemps: 0,
      maxTimeSpent: 0,
      pagination: {
        startIndex: 0,
        endIndex: page - 1
      }
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { gradebook, studentview, studentId, testActivity } = props;

    let { itemsSummary } = gradebook;
    if (studentview && studentId) {
      const filtered = getAggregateByQuestion(testActivity, studentId);
      if (filtered) {
        itemsSummary = filtered.itemsSummary;
      }
      console.log("studentId selected", studentId, "itemsummary", itemsSummary);
    }

    let chartData = [];

    let maxAttemps = 0;
    let maxTimeSpent = 0;
    if (itemsSummary.length) {
      chartData = itemsSummary.map((item, index) => {
        if (item.attemptsNum > maxAttemps) {
          maxAttemps = item.attemptsNum;
        }
        if (item.avgTimeSpent > maxTimeSpent) {
          maxTimeSpent = item.avgTimeSpent;
        }
        return {
          name: `Q${index + 1}`,
          totalAttemps: item.attemptsNum,
          correctAttemps: item.correctNum,
          partialAttempts: item.partialNum || 0,
          incorrectAttemps: item.wrongNum,
          avgTimeSpent: item.avgTimeSpent,
          itemLevelScoring: item.itemLevelScoring,
          skippedNum: item.skippedNum,
          itemId: item.itemId,
          qid: item._id
        };
      });
    }

    if (chartData.length !== state.chartData.length) {
      const renderData = chartData.slice(0, state.page);
      return {
        page: state.page,
        chartData,
        renderData,
        maxAttemps,
        maxTimeSpent,
        pagination: {
          startIndex: 0,
          endIndex: state.page - 1
        }
      };
    }
    const renderData = chartData.slice(state.pagination.startIndex, state.pagination.startIndex + state.page);
    return {
      page: state.page,
      chartData,
      renderData,
      maxAttemps,
      maxTimeSpent,
      pagination: {
        startIndex: state.pagination.startIndex,
        endIndex: state.pagination.startIndex + state.page - 1
      }
    };
  }

  scrollLeft = () => {
    const { pagination, page } = this.state;
    let diff;
    if (pagination.startIndex > 0) {
      if (pagination.startIndex >= page) {
        diff = page;
      } else {
        diff = pagination.startIndex;
      }
      this.setState(state => ({
        ...state,
        pagination: {
          startIndex: state.pagination.startIndex - diff,
          endIndex: state.pagination.endIndex - diff
        }
      }));
    }
  };

  scrollRight = () => {
    const { pagination, page, chartData } = this.state;
    let diff;
    if (pagination.endIndex < chartData.length - 1) {
      if (chartData.length - 1 - pagination.endIndex >= page) {
        diff = page;
      } else {
        diff = chartData.length - 1 - pagination.endIndex;
      }

      this.setState(state => ({
        ...state,
        pagination: {
          startIndex: state.pagination.startIndex + diff,
          endIndex: state.pagination.endIndex + diff
        }
      }));
    }
  };

  static propTypes = {
    // gradebook: PropTypes.object.isRequired,
    onClickHandler: PropTypes.func.isRequired,
    children: PropTypes.node
  };

  static defaultProps = {
    children: null
  };

  handleClick = (data, index) => {
    const { onClickHandler } = this.props;
    if (onClickHandler) {
      onClickHandler(data, index);
    }
  };

  calcTimeSpent(testItem) {
    const { studentResponse, studentview } = this.props;
    let timeSpent = testItem.avgTimeSpent || 0;
    if (studentview) {
      const getStudentActivity = get(studentResponse, "data.questionActivities", []);
      const groupActivityByQId = groupBy(getStudentActivity, "qid") || {};
      const [timeSpentByItemId = {}] = groupActivityByQId[testItem._id] || [];
      timeSpent = timeSpentByItemId.timeSpent || 0;
    }
    return timeSpent;
  }

  render() {
    const { children } = this.props;
    const { pagination, chartData, renderData, maxAttemps, maxTimeSpent } = this.state;
    return (
      <MainDiv className="studentBarChart">
        {children}
        <StyledChartNavButton
          type="primary"
          shape="circle"
          icon="caret-left"
          size="large"
          className="navigator navigator-left"
          onClick={this.scrollLeft}
          style={{
            visibility: pagination.startIndex === 0 ? "hidden" : "visible"
          }}
        />
        <StyledChartNavButton
          type="primary"
          shape="circle"
          icon="caret-right"
          size="large"
          className="navigator navigator-right"
          onClick={this.scrollRight}
          style={{
            visibility: chartData.length <= pagination.endIndex + 1 ? "hidden" : "visible"
          }}
        />
        <ResponsiveContainer width="100%" height={240}>
          <ComposedChart barGap={1} barSize={36} data={renderData}>
            <XAxis
              dataKey="name"
              tickSize={0}
              dy={8}
              tick={{ fontSize: "10px", strokeWidth: 2, fill: secondaryTextColor }}
              padding={{ left: 20, right: 20 }}
            />
            <YAxis
              domain={[0, maxAttemps + Math.ceil((10 / 100) * maxAttemps)]}
              yAxisId="left"
              allowDecimals={false}
              label={{ value: "ATTEMPTS", angle: -90, fill: dropZoneTitleColor, fontSize: "10px" }}
            />
            <YAxis
              yAxisId="right"
              domain={[0, maxTimeSpent + Math.ceil((10 / 100) * maxTimeSpent)]}
              allowDecimals={false}
              label={{
                value: "AVG TIME (SECONDS)",
                angle: -90,
                fill: dropZoneTitleColor,
                fontSize: "10px"
              }}
              orientation="right"
              ticks={ticks(0, maxTimeSpent + 10000, 10)}
              tickFormatter={val => Math.round(val / 1000)}
            />
            <Bar
              yAxisId="left"
              stackId="a"
              dataKey="correctAttemps"
              fill={green}
              shape={<RectangleBar dataKey="correctAttemps" />}
              onClick={this.handleClick}
            />
            <Bar
              yAxisId="left"
              stackId="a"
              dataKey="incorrectAttemps"
              fill={incorrect}
              shape={<RectangleBar dataKey="incorrectAttemps" />}
              onClick={this.handleClick}
            />
            <Bar
              yAxisId="left"
              stackId="a"
              dataKey="partialAttempts"
              fill={yellow}
              shape={<RectangleBar dataKey="partialAttempts" />}
              onClick={this.handleClick}
            />
            <Bar
              yAxisId="left"
              stackId="a"
              dataKey="skippedNum"
              fill={dropZoneTitleColor}
              shape={<RectangleBar dataKey="skippedNum" />}
              onClick={this.handleClick}
            />

            <Line
              yAxisId="right"
              dataKey="avgTimeSpent"
              stroke={blue}
              strokeWidth="3"
              type="monotone"
              dot={{ stroke: white, strokeWidth: 6, fill: white }}
            />

            <Tooltip content={<StyledCustomTooltip />} cursor={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </MainDiv>
    );
  }
}
