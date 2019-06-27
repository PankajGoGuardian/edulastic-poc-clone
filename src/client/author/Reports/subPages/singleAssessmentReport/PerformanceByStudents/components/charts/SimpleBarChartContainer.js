import React, { useState } from "react";
import { maxBy, ceil, get } from "lodash";
import { BarChart, XAxis, YAxis, CartesianGrid, Bar, ReferenceArea, LabelList } from "recharts";
import { NonSelectableResponsiveContainer } from "../styled";
import { createTicks, getInterval } from "../../util/transformers";

const xAxisLabel = {
  value: "Score",
  offset: -5,
  position: "insideBottom"
};

const yAxisLabel = {
  value: "Student Count",
  angle: -90,
  dx: -10
};

const renderLabel = ({ x, y, width, value }) => (
  <text x={x + width / 2} y={y - 10} textAnchor="middle">
    {value ? value : ""}
  </text>
);

const renderYAxisLabel = maxValue => ({ x, y, payload }) => (
  <text x={x - 10} y={y + 5} textAnchor="middle">
    {payload.value >= maxValue + getInterval(maxValue) ? "" : payload.value}
  </text>
);

const SimpleBarChartContainer = ({ data, setRange, range }) => {
  const [selecting, setSelecting] = useState(false);
  const { left = "", right = "" } = range;
  const showSelectedArea = left !== "" && right !== "";

  const onMouseDown = e => {
    if (e) {
      // reset the selected range
      setRange(() => ({ left: "", right: "" }));
      setSelecting(true);
      setRange(range => ({ ...range, left: e.activeLabel }));
    }
  };

  const onMouseMove = e => {
    if (selecting && e) {
      setRange(range => ({ ...range, right: e.activeLabel }));
    }
  };

  const onMouseUp = () => {
    setSelecting(false);
  };

  const maxStudentCount = get(maxBy(data, "studentCount"), "studentCount", 0);
  const interval = getInterval(maxStudentCount);
  const domain = [0, maxStudentCount + ceil(maxStudentCount / interval)];
  const ticks = createTicks(maxStudentCount, interval);

  return (
    <NonSelectableResponsiveContainer width={"100%"} height={450}>
      <BarChart
        width={730}
        height={450}
        data={data}
        barCategoryGap={0}
        margin={{ top: 30, bottom: 30, right: 30 }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      >
        <XAxis label={xAxisLabel} interval={0} dataKey="name" scale={"linear"} />
        <YAxis domain={domain} yAxisId="1" label={yAxisLabel} ticks={ticks} tick={renderYAxisLabel(maxStudentCount)} />
        <CartesianGrid stroke="#eee" vertical={false} />
        <Bar yAxisId="1" dataKey="studentCount" fill="#2b78b5">
          <LabelList position="top" content={renderLabel} />
        </Bar>
        {showSelectedArea ? <ReferenceArea yAxisId="1" x1={left} x2={right} strokeOpacity={0.3} /> : null}
      </BarChart>
    </NonSelectableResponsiveContainer>
  );
};

export default SimpleBarChartContainer;
