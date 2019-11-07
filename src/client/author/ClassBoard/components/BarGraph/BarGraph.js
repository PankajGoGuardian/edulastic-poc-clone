/* eslint-disable react/prop-types */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { get, groupBy, isEmpty } from "lodash";
import { ticks } from "d3-array";
import {
  white,
  pointColor,
  dropZoneTitleColor,
  secondaryTextColor,
  incorrect,
  yellow,
  themeColor
} from "@edulastic/colors";
import { themes } from "../../../../student/themes";
import { ComposedChart, Bar, Line, XAxis, YAxis, ResponsiveContainer, Rectangle, Tooltip } from "recharts";
import { MainDiv, StyledCustomTooltip } from "./styled";
import { StyledChartNavButton } from "../../../Reports/common/styled";
import { getAggregateByQuestion, getItemSummary } from "../../ducks";
import memoizeOne from "memoize-one";
import { scrollTo } from "@edulastic/common";
import { MAX_XGA_WIDTH, NORMAL_MONITOR_WIDTH, LARGE_DESKTOP_WIDTH, MAX_TAB_WIDTH } from "../../../src/constants/others";

/**
 * @param {string} qid
 */
const _scrollTo = qid => scrollTo(document.querySelector(`.question-container-id-${qid}`));
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
  isMobile = () => {
    window.innerWidth < 480;
  };

  constructor(props) {
    super(props);
    let page = props.pageSize || 20;
    const windowWidth = window.innerWidth;
    if (this.isMobile()) {
      page = 5;
    } else if (windowWidth >= LARGE_DESKTOP_WIDTH) {
      page = 20;
    } else if (windowWidth >= NORMAL_MONITOR_WIDTH && windowWidth < LARGE_DESKTOP_WIDTH) {
      page = 15;
    } else if (windowWidth >= MAX_XGA_WIDTH && windowWidth < NORMAL_MONITOR_WIDTH) {
      page = 10;
    } else if (windowWidth >= MAX_TAB_WIDTH && windowWidth < MAX_XGA_WIDTH) {
      page = 7;
    } else {
      /**
       * unknown small resolutions
       */
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
    const { gradebook, studentview, studentViewFilter, studentId, testActivity, studentResponse } = props;
    let { itemsSummary } = gradebook;
    if (studentview && studentId) {
      const filtered = _getAggregateByQuestion(testActivity, studentId);
      const selectedTestActivityId = testActivity.find(x => x.studentId === studentId)?.testActivityId;
      if (filtered) {
        if (isEmpty(studentResponse) || selectedTestActivityId === studentResponse?.testActivity?._id) {
          itemsSummary = filtered.itemsSummary;
        } else {
          itemsSummary = getItemSummary([studentResponse], filtered.questionsOrder, itemsSummary);
        }

        if (studentViewFilter) {
          itemsSummary = itemsSummary.filter(x => {
            if (studentViewFilter === "correct" && x.correctNum > 0) {
              return true;
            } else if (studentViewFilter === "wrong" && x.wrongNum > 0) {
              return true;
            } else if (studentViewFilter === "partial" && x.partialNum > 0) {
              return true;
            } else if (studentViewFilter === "skipped" && x.skippedNum > 0) {
              return true;
            } else if (studentViewFilter === "notGraded" && x.manualGradedNum > 0) {
              return true;
            } else {
              return false;
            }
          });
        }
      }
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
          name: item.barLabel,
          totalAttemps: item.attemptsNum,
          correctAttemps: item.correctNum,
          partialAttempts: item.partialNum || 0,
          incorrectAttemps: item.wrongNum,
          manualGradedNum: item.manualGradedNum,
          avgTimeSpent: item.avgTimeSpent || 0,
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
    if (this.props.studentview) {
      const { qid } = data;
      _scrollTo(qid);
    } else {
      const { onClickHandler } = this.props;
      if (onClickHandler) {
        onClickHandler(data, index);
      }
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
          {chartData.length === 0 ? (
            <h3 style={{ textAlign: "center" }}> No Question found </h3>
          ) : (
            <ComposedChart barGap={1} barSize={36} data={renderData}>
              <XAxis
                dataKey="name"
                tickSize={0}
                dy={8}
                tick={{ fontSize: "10px", strokeWidth: 2, fill: secondaryTextColor }}
                padding={{ left: 20, right: 20 }}
                cursor="pointer"
                onClick={({ index }) => {
                  this.handleClick(renderData[index], index);
                }}
              />
              <YAxis
                domain={[0, maxAttemps + Math.ceil((10 / 100) * maxAttemps)]}
                yAxisId="left"
                allowDecimals={false}
                label={{
                  value: "ATTEMPTS",
                  dx: -10,
                  angle: -90,
                  fill: dropZoneTitleColor,
                  fontSize: "10px"
                }}
              />
              <YAxis
                yAxisId="right"
                domain={[0, maxTimeSpent + Math.ceil((10 / 100) * maxTimeSpent)]}
                allowDecimals={false}
                label={{
                  value: "AVG TIME (SECONDS)",
                  angle: -90,
                  dx: 10,
                  fill: dropZoneTitleColor,
                  fontSize: "10px"
                }}
                orientation="right"
                ticks={ticks(0, maxTimeSpent + 10000, 10)}
                tickFormatter={val => Math.round(val / 1000)}
              />
              <Bar
                className="correctAttemps"
                yAxisId="left"
                stackId="a"
                dataKey="correctAttemps"
                fill="#5eb500"
                shape={<RectangleBar dataKey="correctAttemps" />}
                onClick={this.handleClick}
              />
              <Bar
                className="incorrectAttemps"
                yAxisId="left"
                stackId="a"
                dataKey="incorrectAttemps"
                fill={incorrect}
                shape={<RectangleBar dataKey="incorrectAttemps" />}
                onClick={this.handleClick}
              />
              <Bar
                className="partialAttempts"
                yAxisId="left"
                stackId="a"
                dataKey="partialAttempts"
                fill={yellow}
                shape={<RectangleBar dataKey="partialAttempts" />}
                onClick={this.handleClick}
              />
              <Bar
                className="skippedNum"
                yAxisId="left"
                stackId="a"
                dataKey="skippedNum"
                fill={themes.default.classboard.SkippedColor}
                shape={<RectangleBar dataKey="skippedNum" />}
                onClick={this.handleClick}
              />

              <Bar
                className="manualGradedNum"
                yAxisId="left"
                stackId="a"
                dataKey="manualGradedNum"
                fill="rgb(56, 150, 190)"
                shape={<RectangleBar dataKey="manualGradedNum" />}
                onClick={this.handleClick}
              />

              <Line
                yAxisId="right"
                dataKey="avgTimeSpent"
                stroke={themeColor}
                strokeWidth="3"
                type="monotone"
                dot={{ stroke: themeColor, strokeWidth: 6, fill: white }}
              />

              <Tooltip content={<StyledCustomTooltip />} cursor={false} />
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </MainDiv>
    );
  }
}
