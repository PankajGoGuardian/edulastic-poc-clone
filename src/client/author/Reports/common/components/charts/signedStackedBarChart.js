import React, { useState, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Legend,
  ReferenceLine
} from "recharts";
import { isEmpty } from "lodash";
import styled from "styled-components";
import { StyledCustomChartTooltip, StyledChartNavButton } from "../../styled";
import { CustomChartXTick } from "./chartUtils/customChartXTick";
import { YAxisLabel } from "./chartUtils/yAxisLabel";

const _yTickFormatter = val => {
  if (val !== 0) {
    return val + "%";
  } else {
    return "";
  }
};

const LabelText = props => {
  let { x, y, width, height, value, formatter, onBarMouseOver, onBarMouseLeave, bdIndex } = props;
  return (
    <g class="asd-asd" onMouseOver={onBarMouseOver(bdIndex)} onMouseLeave={onBarMouseLeave(bdIndex)}>
      <text x={x + width / 2} y={y + height / 2} textAnchor="middle" dominantBaseline="middle">
        {formatter(value)}
      </text>
    </g>
  );
};

export const SignedStackedBarChart = ({
  margin = { top: 0, right: 20, left: 20, bottom: 0 },
  pageSize,
  barsData,
  data = [],
  yDomain = [-100, 110],
  ticks = [-100, -81, -54, -27, 27, 54, 81, 110],
  xAxisDataKey,
  onBarClickCB,
  onResetClickCB,
  getXTickText,
  getTooltipJSX,
  yAxisLabel = "",
  yTickFormatter = _yTickFormatter,
  barsLabelFormatter = _yTickFormatter,
  referenceLine = 0,
  filter = {}
}) => {
  const page = pageSize || 7;
  const [pagination, setPagination] = useState({ startIndex: 0, endIndex: page - 1 });
  const [copyData, setCopyData] = useState(null);
  const [barIndex, setBarIndex] = useState(null);

  const constants = {
    COLOR_BLACK: "#010101",
    TICK_FILL: { fill: "#010101", fontWeight: "bold" },
    Y_AXIS_LABEL: { value: yAxisLabel, angle: -90, dx: 25, fontSize: 14 }
  };

  if (data !== copyData) {
    setPagination({
      startIndex: 0,
      endIndex: page - 1
    });
    setCopyData(data);
  }

  const chartData = useMemo(() => {
    return [...data];
  }, [pagination]);

  const renderData = useMemo(() => {
    return chartData.slice(pagination.startIndex, pagination.startIndex + page);
  }, [pagination, data]);

  const scrollLeft = () => {
    let diff;
    if (pagination.startIndex > 0) {
      if (pagination.startIndex >= page) {
        diff = page;
      } else {
        diff = pagination.startIndex;
      }
      setPagination({
        startIndex: pagination.startIndex - diff,
        endIndex: pagination.endIndex - diff
      });
    }
  };

  const scrollRight = () => {
    let diff;
    if (pagination.endIndex < chartData.length - 1) {
      if (chartData.length - 1 - pagination.endIndex >= page) {
        diff = page;
      } else {
        diff = chartData.length - 1 - pagination.endIndex;
      }
      setPagination({
        startIndex: pagination.startIndex + diff,
        endIndex: pagination.endIndex + diff
      });
    }
  };

  const onBarClick = args => {
    onBarClickCB(args[xAxisDataKey]);
  };

  const onResetClick = () => {
    onResetClickCB();
  };

  const onBarMouseOver = index => () => {
    setBarIndex(index);
  };

  const onBarMouseLeave = index => () => {
    setBarIndex(null);
  };

  return (
    <StyledSignedStackedBarChartContainer>
      <a
        onClick={onResetClick}
        style={Object.keys(filter).length > 0 ? { visibility: "visible" } : { visibility: "hidden" }}
      >
        Reset
      </a>
      <StyledChartNavButton
        type="primary"
        shape="circle"
        icon="caret-left"
        size={"large"}
        className="navigator navigator-left"
        onClick={scrollLeft}
        style={{
          visibility: pagination.startIndex == 0 ? "hidden" : "visible"
        }}
      />
      <StyledChartNavButton
        type="primary"
        shape="circle"
        icon="caret-right"
        size={"large"}
        className="navigator navigator-right"
        onClick={scrollRight}
        style={{
          visibility: chartData.length <= pagination.endIndex + 1 ? "hidden" : "visible"
        }}
      />
      <ResponsiveContainer width={"100%"} height={400}>
        <BarChart width={730} height={400} data={renderData} stackOffset="sign" margin={margin}>
          <CartesianGrid vertical={false} strokeWidth={0.5} />
          <XAxis
            dataKey={xAxisDataKey}
            tick={<CustomChartXTick data={renderData} getXTickText={getXTickText} />}
            interval={0}
          />
          <YAxis
            type={"number"}
            domain={yDomain}
            tick={constants.TICK_FILL}
            ticks={ticks}
            tickFormatter={yTickFormatter}
            label={<YAxisLabel data={constants.Y_AXIS_LABEL} />}
          />
          <Tooltip cursor={false} content={<StyledCustomChartTooltip getJSX={getTooltipJSX} barIndex={barIndex} />} />
          <Legend align="left" verticalAlign="top" />
          <ReferenceLine y={referenceLine} stroke={constants.COLOR_BLACK} />
          {barsData.map((bdItem, bdIndex) => {
            return (
              <Bar
                key={bdItem.key}
                dataKey={bdItem.key}
                name={bdItem.name}
                stackId={bdItem.stackId}
                fill={bdItem.fill}
                unit={bdItem.unit}
                onClick={onBarClick}
                barSize={70}
                onMouseOver={onBarMouseOver(bdIndex)}
                onMouseLeave={onBarMouseLeave(bdIndex)}
                minPointSize={20}
              >
                <LabelList
                  dataKey={bdItem.key}
                  position="inside"
                  fill="#010101"
                  offset={5}
                  onMouseOver={onBarMouseOver(bdIndex)}
                  onMouseLeave={onBarMouseLeave(bdIndex)}
                  content={
                    <LabelText
                      onBarMouseOver={onBarMouseOver}
                      onBarMouseLeave={onBarMouseLeave}
                      bdIndex={bdIndex}
                      formatter={barsLabelFormatter}
                    />
                  }
                />
                {renderData.map((cdItem, cdIndex) => {
                  {
                    return filter[cdItem[xAxisDataKey]] || isEmpty(filter) ? (
                      <Cell key={cdItem[xAxisDataKey]} fill={cdItem["fill_" + bdIndex]} />
                    ) : (
                      <Cell key={cdItem[xAxisDataKey]} fill={"#c0c0c0"} />
                    );
                  }
                })}
              </Bar>
            );
          })}
        </BarChart>
      </ResponsiveContainer>
    </StyledSignedStackedBarChartContainer>
  );
};

const StyledSignedStackedBarChartContainer = styled.div`
  padding: 10px;
  overflow: hidden;

  .navigator-left {
    left: 5px;
    top: 50%;
  }

  .navigator-right {
    right: 5px;
    top: 50%;
  }

  .recharts-wrapper .recharts-cartesian-grid-horizontal line:first-child,
  .recharts-wrapper .recharts-cartesian-grid-horizontal line:last-child {
    stroke-opacity: 0;
  }

  .recharts-yAxis {
    .recharts-text {
      tspan {
        white-space: pre;
      }
    }
  }
`;
