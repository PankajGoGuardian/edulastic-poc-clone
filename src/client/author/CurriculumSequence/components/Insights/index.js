import React from "react";
import styled from "styled-components";
import { Row, Col } from "antd";

import InsightsChart from "./components/InsightsChart";
import BoxedInsightsSummary from "./components/BoxedInsightsSummary";
import StandardsInsightsTable from "./components/StandardsInsightsTable";

import * as data from "./dummyData.json";

const Insights = () => {
  return (
    <InsightsContainer type="flex" gutter={[10, 40]} justify="center">
      <StyledCol xs={24} sm={24} md={24} lg={15} xl={17} xxl={18}>
        <InsightsChart data={data.chartData} />
      </StyledCol>
      <StyledCol xs={24} sm={24} md={24} lg={9} xl={7} xxl={6}>
        <Row>
          <BoxedInsightsSummary data={data.summaryData} />
          <StandardsInsightsTable data={data.standardsData} />
        </Row>
      </StyledCol>
    </InsightsContainer>
  );
};

export default Insights;

const InsightsContainer = styled(Row)`
  width: 100%;
  padding: 40px 40px 0 40px;
`;

const StyledCol = styled(Col)`
  display: flex;
  justify-content: center;
`;
