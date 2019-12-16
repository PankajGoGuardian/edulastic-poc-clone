import React, { useEffect } from "react";
import styled from "styled-components";
import { StyledH2 } from "./styled";
import { LineChart } from "../../../../common/components/charts/LineChart";

const chartData = [
  { date: "DEC/18", bank1: 1, bank2: 2 },
  { date: "JAN/19", bank1: 2, bank2: 3 },
  { date: "FEB/19", bank1: 4, bank2: 5 },
  { date: "MAR/19", bank1: 3, bank2: 4 },
  { date: "APR/19", bank1: 5, bank2: 6 },
  { date: "MAY/19", bank1: 7, bank2: 8 },
  { date: "JUN/19", bank1: 5, bank2: 5 },
  { date: "JUL/19", bank1: 6, bank2: 7 },
  { date: "AUG/19", bank1: 8, bank2: 9 },
  { date: "SEP/19", bank1: 9, bank2: 10 },
  { date: "OCT/19", bank1: 8, bank2: 8 },
  { date: "NOV/19", bank1: 9, bank2: 10 },
  { date: "DEC/19", bank1: 8, bank2: 11 }
];

const lineData = [
  { dataKey: "bank1", stroke: "#D36DF6", lineLabel: "Bank 1" },
  { dataKey: "bank2", stroke: "#0090FF", lineLabel: "Bank 2" }
];

const Usage = props => {
  const { className } = props;

  return (
    <div className={className}>
      <StyledH2>Usage</StyledH2>
      <LineChart chartData={chartData} lineData={lineData} xAxisDataKey="date" yAxisLabel="TXN/DAY" />
    </div>
  );
};

const StyledUsage = styled(Usage)`
  padding: 0 10px;
`;

export { StyledUsage as Usage };
