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
  Brush,
  ReferenceLine
} from "recharts";
import { isEmpty } from "lodash";
import styled from "styled-components";
import { StyledCustomChartTooltip, StyledChartNavButton } from "../../styled";
import { CustomChartXTick } from "./chartUtils/customChartXTick";

const yTickFormatter = val => {
  if (val !== 0) {
    return val + "%";
  } else {
    return "";
  }
};

export const SignedStackedBarChart = ({
  pageSize,
  barsData,
  data = [],
  yDomain = [-110, 110],
  ticks = [-100, -90, -80, -70, -60, -50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  xAxisDataKey,
  onBarClickCB,
  onResetClickCB,
  getXTickText,
  getTooltipJSX,
  yAxisLabel = "",
  yTickFormatter = yTickFormatter,
  referenceLine = 0,
  filter = {}
}) => {
  const page = pageSize || 7;
  const [pagination, setPagination] = useState({ startIndex: 0, endIndex: page - 1 });
  const [copyData, setCopyData] = useState(null);

  const constants = {
    COLOR_BLACK: "#010101",
    TICK_FILL: { fill: "#010101", fontWeight: "bold" },
    Y_AXIS_LABEL: { value: yAxisLabel, angle: -90, dx: -30 }
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
        <BarChart width={730} height={400} data={renderData} stackOffset="sign">
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
            label={constants.Y_AXIS_LABEL}
          />
          <Tooltip cursor={false} content={<StyledCustomChartTooltip getJSX={getTooltipJSX} />} />
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
              >
                <LabelList
                  dataKey={bdItem.key}
                  position="inside"
                  fill="#010101"
                  offset={5}
                  formatter={yTickFormatter}
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
