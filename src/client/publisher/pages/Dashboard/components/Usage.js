import React, { useEffect } from "react";
import styled from "styled-components";
import { StyledH2 } from "./styled";
import { LineChart } from "../../../../common/components/charts/LineChart";

const chartData = [
  { date: "DEC/18", bank1: 0, bank2: 1.8 },
  { date: "JAN/19", bank1: 2.1, bank2: 2.1 },
  { date: "FEB/19", bank1: 4, bank2: 2.2 },
  { date: "MAR/19", bank1: 4.1, bank2: 2.1 },
  { date: "APR/19", bank1: 4.2, bank2: 2 },
  { date: "MAY/19", bank1: 4.3, bank2: 1.9 },
  { date: "JUN/19", bank1: 4.4, bank2: 1.8 },
  { date: "JUL/19", bank1: 5, bank2: 1.9 },
  { date: "AUG/19", bank1: 6, bank2: 2.5 },
  { date: "SEP/19", bank1: 7, bank2: 2.4 },
  { date: "OCT/19", bank1: 7.6, bank2: 2.3 },
  { date: "NOV/19", bank1: 7.5, bank2: 2.3 }
];

const lineData = [
  // { dataKey: "bank1", stroke: "#D36DF6", lineLabel: "Bank 1" },
  // { dataKey: "bank2", stroke: "#0090FF", lineLabel: "Bank 2" }
  { dataKey: "bank1", stroke: "#AB2EFE80", lineLabel: "Bank 1", labelStroke: "#D36DF6" },
  { dataKey: "bank2", stroke: "#AAC2FF", lineLabel: "Bank 2", labelStroke: "#0090FF" }
];

const Usage = props => {
  const { className } = props;

  return (
    <div className={className}>
      <StyledH2>Usage</StyledH2>
      <LineChart chartData={chartData} lineData={lineData} xAxisDataKey="date" yAxisLabel="TXN / DAY" />
    </div>
  );
};

const StyledUsage = styled(Usage)`
  padding: 0 10px;
`;

export { StyledUsage as Usage };
