import React from "react";
import PropTypes from "prop-types";
import { BarChart, XAxis, YAxis, Bar, CartesianGrid, LabelList, ResponsiveContainer, Tooltip } from "recharts";

import { secondaryTextColor } from "@edulastic/colors";

const SimpleBarChart = ({
  data,
  xDataKey,
  barDataKey,
  yLabel,
  xTickFormatter,
  yTickFormatter,
  onBarClick,
  renderBarCells,
  formatScore,
  ticks,
  renderTooltip,
  onResetClick,
  showReset
}) => {
  const renderLabel = ({ x, y, width, value }) => (
    <text x={x + width / 2} y={y - 10} textAnchor="middle" fill={secondaryTextColor}>
      {formatScore(value)}
    </text>
  );

  return (
    <div>
      <a onClick={onResetClick} style={showReset ? { visibility: "visible" } : { visibility: "hidden" }}>
        Reset
      </a>
      <ResponsiveContainer width="100%" aspect={5.0}>
        <BarChart data={data} margin={{ top: 30 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey={xDataKey} tickFormatter={xTickFormatter} />
          <YAxis label={yLabel} tickFormatter={yTickFormatter} ticks={ticks} interval={0} />
          <Tooltip content={renderTooltip} cursor={false} />
          <Bar dataKey={barDataKey} barSize={60} onClick={onBarClick}>
            <LabelList dataKey={barDataKey} position="top" content={renderLabel} />
            {renderBarCells(data)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

SimpleBarChart.propTypes = {
  data: PropTypes.array.isRequired,
  xDataKey: PropTypes.string.isRequired,
  barDataKey: PropTypes.string.isRequired,
  yLabel: PropTypes.object.isRequired,
  xTickFormatter: PropTypes.func.isRequired,
  yTickFormatter: PropTypes.func.isRequired,
  onBarClick: PropTypes.func.isRequired,
  renderBarCells: PropTypes.func.isRequired,
  formatScore: PropTypes.func.isRequired,
  ticks: PropTypes.array,
  renderTooltip: PropTypes.func
};

SimpleBarChart.defaultProps = {
  ticks: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  tooltip: () => null
};

export default SimpleBarChart;
