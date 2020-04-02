import React, { useState, useEffect, useMemo } from "react";
import {
  ComposedChart,
  Bar,
  Line,
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
import styled from "styled-components";
import { StyledCustomChartTooltip, StyledChartNavButton, CustomXAxisTickTooltipContainer } from "../../styled";
import { CustomChartXTick, calculateXCoordinateOfXAxisToolTip } from "./chartUtils/customChartXTick";

const _yTickFormatter = val => {
  return val + "%";
};

const LabelText = props => {
  let { x, y, width, height, value, formatter, onBarMouseOver, onBarMouseLeave, index, startIndex } = props;
  return (
    <g class="asd-asd" onMouseOver={onBarMouseOver()} onMouseLeave={onBarMouseLeave()}>
      <text x={x + width / 2} y={y + height} textAnchor="middle" dominantBaseline="text-after-edge">
        {formatter(value, index, startIndex, x, y)}
      </text>
    </g>
  );
};

export const SimpleStackedBarChart = ({
  margin = { top: 0, right: 60, left: 60, bottom: 0 },
  xTickTooltipPosition = 460,
  xTickToolTipWidth = 110,
  pageSize,
  data = [],
  yDomain = [0, 110],
  ticks = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  xAxisDataKey,
  bottomStackDataKey,
  topStackDataKey,
  onBarClickCB,
  onResetClickCB,
  getXTickText,
  getTooltipJSX = () => null,
  TooltipCursor = false,
  yAxisLabel = "",
  yTickFormatter = _yTickFormatter,
  barsLabelFormatter = _yTickFormatter,
  filter = {},
  referenceLineY = null,
  lineYDomain = [0, 110],
  lineChartDataKey = false,
  lineProps = {},
  lineDotProps = {},
  lineTicks = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  lineYTickFormatter = _yTickFormatter,
  lineYAxisLabel = ""
}) => {
  const page = pageSize || 7;
  const [pagination, setPagination] = useState({ startIndex: 0, endIndex: page - 1 });
  const [copyData, setCopyData] = useState(null);
  const [barIndex, setBarIndex] = useState(null);
  const [isDotActive, setDotActive] = useState(false);
  const [xAxisTickTooltipData, setXAxisTickTooltipData] = useState({
    visibility: "hidden",
    x: null,
    y: null,
    content: null
  });

  const constants = {
    COLOR_BLACK: "#010101",
    TICK_FILL: { fill: "#010101", fontWeight: "normal" },
    Y_AXIS_LABEL: { value: yAxisLabel.toUpperCase(), angle: -90, dx: -55 },
    LINE_Y_AXIS_LABEL: { value: lineYAxisLabel, angle: -90, dx: 50 }
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
    onBarClickCB(args[xAxisDataKey], args);
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

  const renderToolTipCursor = () =>
    isDotActive ? <TooltipCursor lineYDomain={lineYDomain} yDomain={yDomain} /> : null;

  const onXAxisTickTooltipMouseOver = payload => {
    const { coordinate } = payload;
    let content;
    if (getXTickText) {
      content = getXTickText(payload, chartData);
    } else {
      content = payload.value;
    }

    data = {
      visibility: "visible",
      x: `${calculateXCoordinateOfXAxisToolTip(coordinate, xTickToolTipWidth)}px`,
      y: `${xTickTooltipPosition}px`,
      content
    };
    setXAxisTickTooltipData(data);
  };

  const onXAxisTickTooltipMouseOut = () => {
    setXAxisTickTooltipData({ visibility: "hidden", x: null, y: null, content: null });
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
      <CustomXAxisTickTooltipContainer
        x={xAxisTickTooltipData.x}
        y={xAxisTickTooltipData.y}
        visibility={xAxisTickTooltipData.visibility}
        color={xAxisTickTooltipData.color}
        width={xTickToolTipWidth}
      >
        {xAxisTickTooltipData.content}
      </CustomXAxisTickTooltipContainer>
      <ResponsiveContainer width={"100%"} height={400}>
        <ComposedChart width={730} height={400} data={chartData} margin={margin}>
          <CartesianGrid vertical={false} strokeWidth={0.5} />
          <XAxis
            dataKey={xAxisDataKey}
            tick={<CustomChartXTick data={chartData} getXTickText={getXTickText} />}
            interval={0}
            axisLine={{
              stroke: "#E5E5E5"
            }}
            tickLine={false}
            onMouseOver={onXAxisTickTooltipMouseOver}
            onMouseOut={onXAxisTickTooltipMouseOut}
          />
          <YAxis
            type={"number"}
            yAxisId="barChart"
            domain={yDomain}
            tick={constants.TICK_FILL}
            ticks={ticks}
            tickFormatter={yTickFormatter}
            label={constants.Y_AXIS_LABEL}
            axisLine={false}
            tickLine={{
              stroke: "#4A4A4A"
            }}
            tickSize="9"
            tickMargin="6"
            style={{ transform: "translate(-25px)" }}
          />
          />
          <Brush
            dataKey={xAxisDataKey}
            height={0}
            width={0}
            startIndex={pagination.startIndex}
            endIndex={pagination.endIndex}
          />
          <Bar
            dataKey={bottomStackDataKey}
            yAxisId="barChart"
            stackId="a"
            unit={"%"}
            onClick={onBarClick}
            barSize={45}
            onMouseOver={onBarMouseOver(1)}
            onMouseLeave={onBarMouseLeave(null)}
          />
          <Bar
            dataKey={topStackDataKey}
            yAxisId="barChart"
            stackId="a"
            onClick={onBarClick}
            barSize={45}
            onMouseOver={onBarMouseOver(1)}
            onMouseLeave={onBarMouseLeave(null)}
          >
            <LabelList
              dataKey={bottomStackDataKey}
              position="insideBottom"
              fill="#010101"
              offset={5}
              onMouseOver={onBarMouseOver(1)}
              onMouseLeave={onBarMouseLeave(null)}
              content={
                <LabelText
                  startIndex={pagination.startIndex}
                  onBarMouseOver={onBarMouseOver}
                  onBarMouseLeave={onBarMouseLeave}
                  formatter={barsLabelFormatter}
                />
              }
            />
            {chartData.map((entry, index) => {
              return <Cell radius={[10, 10, 0, 0]} key={entry[xAxisDataKey]} fill={"#e5e5e5"} />;
            })}
          </Bar>
          {lineChartDataKey ? (
            <YAxis
              yAxisId="lineChart"
              domain={lineYDomain ? lineYDomain : null}
              label={constants.LINE_Y_AXIS_LABEL}
              ticks={lineTicks}
              orientation="right"
              tickFormatter={lineYTickFormatter}
              axisLine={false}
              tickLine={{
                stroke: "#4A4A4A"
              }}
              tickSize="9"
              tickMargin="6"
              style={{ transform: "translate(20px)" }}
            />
          ) : null}
          {lineChartDataKey ? (
            <Line
              activeDot={{
                onMouseOver: o => {
                  setDotActive(true);
                  setBarIndex(1);
                },
                onMouseLeave: o => {
                  setDotActive(false);
                  setBarIndex(null);
                },
                r: 5,
                ...lineDotProps
              }}
              yAxisId="lineChart"
              type="linear"
              dataKey={lineChartDataKey}
              dot={lineDotProps}
              {...lineProps}
            />
          ) : null}
          {referenceLineY > 0 ? <ReferenceLine yAxisId={"barChart"} y={referenceLineY} stroke="#010101" /> : null}
          <Tooltip
            cursor={typeof TooltipCursor === "boolean" ? TooltipCursor : renderToolTipCursor()}
            content={<StyledCustomChartTooltip getJSX={getTooltipJSX} barIndex={barIndex} />}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </StyledStackedBarChartContainer>
  );
};

const StyledStackedBarChartContainer = styled.div`
  padding: 10px;
  overflow: hidden;

  .recharts-cartesian-axis-ticks {
    font-size: 12px;
  }

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
