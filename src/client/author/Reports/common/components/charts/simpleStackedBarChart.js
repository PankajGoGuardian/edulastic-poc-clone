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
  Brush
} from "recharts";
import styled from "styled-components";
import { StyledCustomChartTooltip, StyledChartNavButton } from "../../styled";
import { CustomChartXTick } from "./chartUtils/customChartXTick";

const yTickFormatter = val => {
  return val + "%";
};

export const SimpleStackedBarChart = ({
  pageSize,
  data,
  domain = [0, 110],
  ticks = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  xAxisDataKey,
  bottomStackDataKey,
  topStackDataKey,
  onBarClickCB,
  onResetClickCB,
  getXTickText,
  getTooltipJSX,
  yAxisLabel,
  yTickFormatter = yTickFormatter
}) => {
  const page = pageSize || 7;
  const [pagination, setPagination] = useState({ startIndex: 0, endIndex: page - 1 });
  const [filter, setFilter] = useState({});

  const constants = {
    COLOR_BLACK: "#010101",
    TICK_FILL: { fill: "#010101", fontWeight: "bold" },
    Y_AXIS_LABEL: { value: yAxisLabel, angle: -90, position: "insideLeft", textAnchor: "middle" }
  };

  const chartData = useMemo(() => {
    return [...data];
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
    let _filter = { ...filter };
    if (_filter[args[xAxisDataKey]]) {
      delete _filter[args[xAxisDataKey]];
    } else {
      _filter[args[xAxisDataKey]] = true;
    }
    setFilter(_filter);
    onBarClickCB(_filter);
  };

  const onResetClick = () => {
    setFilter({});
    onResetClickCB({});
  };

  return (
    <StyledStackedBarChartContainer>
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
        <BarChart width={730} height={400} data={chartData}>
          <CartesianGrid vertical={false} strokeWidth={0.5} />
          <XAxis
            dataKey={xAxisDataKey}
            tick={<CustomChartXTick data={chartData} getXTickText={getXTickText} />}
            interval={0}
          />
          <YAxis
            type={"number"}
            domain={domain}
            tick={constants.TICK_FILL}
            ticks={ticks}
            tickFormatter={yTickFormatter}
            label={constants.Y_AXIS_LABEL}
          />
          <Tooltip cursor={false} content={<StyledCustomChartTooltip getJSX={getTooltipJSX} />} />
          <Brush
            dataKey={xAxisDataKey}
            height={0}
            width={0}
            startIndex={pagination.startIndex}
            endIndex={pagination.endIndex}
          />
          <Bar dataKey={bottomStackDataKey} stackId="a" unit={"%"} onClick={onBarClick} />
          <Bar dataKey={topStackDataKey} stackId="a" onClick={onBarClick}>
            <LabelList
              dataKey={bottomStackDataKey}
              position="insideBottom"
              fill="#010101"
              offset={5}
              formatter={yTickFormatter}
            />
            {chartData.map((entry, index) => {
              return <Cell key={entry[xAxisDataKey]} fill={"#c0c0c0"} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </StyledStackedBarChartContainer>
  );
};

const StyledStackedBarChartContainer = styled.div`
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
`;
