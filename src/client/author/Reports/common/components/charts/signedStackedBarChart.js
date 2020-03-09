import React, { useState, useMemo } from "react";
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
import { StyledCustomChartTooltip, StyledChartNavButton, CustomXAxisTickTooltipContainer } from "../../styled";
import { CustomChartXTick, calculateXCoordinateOfXAxisToolTip } from "./chartUtils/customChartXTick";
import { YAxisLabel } from "./chartUtils/yAxisLabel";

const _barsLabelFormatter = val => {
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
  margin = { top: 0, right: 60, left: 60, bottom: 0 },
  xTickTooltipPosition = 460,
  xTickToolTipWidth = 110,
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
  yTickFormatter = val => val + "%",
  barsLabelFormatter = _barsLabelFormatter,
  referenceLine = 0,
  filter = {}
}) => {
  const page = pageSize || 7;
  const [pagination, setPagination] = useState({ startIndex: 0, endIndex: page - 1 });
  const [copyData, setCopyData] = useState(null);
  const [barIndex, setBarIndex] = useState(null);
  const [activeLegend, setActiveLegend] = useState(null);
  const [xAxisTickTooltipData, setXAxisTickTooltipData] = useState({
    visibility: "hidden",
    x: null,
    y: null,
    content: null
  });

  const constants = {
    COLOR_BLACK: "#010101",
    TICK_FILL: { fill: "#010101", fontWeight: "bold" },
    Y_AXIS_LABEL: { value: yAxisLabel.toUpperCase(), angle: -90, dx: 25, fontSize: 14 }
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

  const onLegendMouseEnter = ({ dataKey }) => setActiveLegend(dataKey);
  const onLegendMouseLeave = () => setActiveLegend(null);

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
        <BarChart width={730} height={400} data={renderData} stackOffset="sign" margin={margin}>
          <CartesianGrid vertical={false} strokeWidth={0.5} />
          <XAxis
            dataKey={xAxisDataKey}
            tick={<CustomChartXTick data={renderData} getXTickText={getXTickText} />}
            interval={0}
            onMouseOver={onXAxisTickTooltipMouseOver}
            onMouseOut={onXAxisTickTooltipMouseOut}
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
          <Legend
            align="left"
            verticalAlign="top"
            onMouseEnter={onLegendMouseEnter}
            onMouseLeave={onLegendMouseLeave}
          />
          <ReferenceLine y={referenceLine} stroke={constants.COLOR_BLACK} />
          {barsData.map((bdItem, bdIndex) => {
            let fillOpacity = 1;

            if (activeLegend && activeLegend !== bdItem.key) {
              fillOpacity = 0.2;
            }

            return (
              <Bar
                key={bdItem.key}
                dataKey={bdItem.key}
                name={bdItem.name}
                stackId={bdItem.stackId}
                fill={bdItem.fill}
                unit={bdItem.unit}
                onClick={onBarClick}
                barSize={45}
                onMouseOver={onBarMouseOver(bdIndex)}
                onMouseLeave={onBarMouseLeave(bdIndex)}
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
                  return filter[cdItem[xAxisDataKey]] || isEmpty(filter) ? (
                    <Cell
                      radius={[10, 10, 0, 0]}
                      key={cdItem[xAxisDataKey]}
                      fill={bdItem.fill}
                      fillOpacity={fillOpacity}
                    />
                  ) : (
                    <Cell radius={[10, 10, 0, 0]} key={cdItem[xAxisDataKey]} fill={"#c0c0c0"} />
                  );
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
