import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { get, head } from "lodash";
import { connect } from "react-redux";
import { Row, Col } from "antd";
import {
  getReportsPeerProgressAnalysis,
  getReportsPeerProgressAnalysisLoader,
  getPeerProgressAnalysisRequestAction
} from "./ducks";
import { getUserRole } from "../../../../../student/Login/ducks";

import TrendCard from "./components/TrendCard";
import PeerProgressAnalysisTable from "./components/table/PeerProgressAnalysisTable";
import { Placeholder } from "../../../common/components/loader";
import { StyledCard, StyledH3 } from "../../../common/styled";
import { getReportsMARFilterData } from "../common/filterDataDucks";
import { parseData, augmentWithData, calculateTrend } from "./utils/transformers";

import dropDownData from "./static/json/dropDownData.json";

// -----|-----|-----|-----|-----| COMPONENT BEGIN |-----|-----|-----|-----|----- //

const usefetchProgressHook = (settings, compareBy, fetchAction) => {
  useEffect(() => {
    const { requestFilters = {} } = settings;
    const { termId = "" } = requestFilters;

    if (termId) {
      fetchAction({
        compareBy: compareBy.key,
        termId
      });
    }
  }, [settings, compareBy.key]);
};

const PeerProgressAnalysis = ({
  getPeerProgressAnalysisRequestAction,
  peerProgressAnalysis,
  MARFilterData,
  settings,
  loading,
  role
}) => {
  const [analyseBy, setAnalyseBy] = useState(head(dropDownData.analyseByData));
  const [compareBy, setCompareBy] = useState(head(dropDownData.compareByData));

  usefetchProgressHook(settings, compareBy, getPeerProgressAnalysisRequestAction);

  const { metricInfo = [] } = get(peerProgressAnalysis, "data.result", {});
  const { orgData = [], testData = [] } = get(MARFilterData, "data.result", []);

  const parsedData = parseData(metricInfo, compareBy.key, orgData);
  const [dataWithTrend, trendCount] = calculateTrend(parsedData);
  const augmentedData = augmentWithData(dataWithTrend, compareBy.key, orgData);

  console.log(augmentedData, dataWithTrend);

  const onFilterChange = (key, selectedItem) => {
    switch (key) {
      case "compareBy":
        setCompareBy(selectedItem);
        break;
      case "analyseBy":
        setAnalyseBy(selectedItem);
        break;
      default:
        return;
    }
  };

  if (loading) {
    return (
      <>
        <Placeholder />
        <Placeholder />
      </>
    );
  }

  return (
    <>
      <UpperContainer>
        <PaddedContainer>
          <StyledH3>Distribution of student subgroup as per progress trend ?</StyledH3>
        </PaddedContainer>
        <TrendContainer>
          <Col span={8}>
            <PaddedContainer>
              <TrendCard type="up" count={trendCount.up} />
            </PaddedContainer>
          </Col>
          <Col span={8}>
            <PaddedContainer>
              <TrendCard type="flat" count={trendCount.flat} />
            </PaddedContainer>
          </Col>
          <Col span={8}>
            <PaddedContainer>
              <TrendCard type="down" count={trendCount.down} />
            </PaddedContainer>
          </Col>
        </TrendContainer>
      </UpperContainer>
      <PeerProgressAnalysisTable
        data={augmentedData}
        testData={testData}
        compareBy={compareBy}
        analyseBy={analyseBy}
        onFilterChange={onFilterChange}
      />
    </>
  );
};

const enhance = connect(
  state => ({
    peerProgressAnalysis: getReportsPeerProgressAnalysis(state),
    loading: getReportsPeerProgressAnalysisLoader(state),
    role: getUserRole(state),
    MARFilterData: getReportsMARFilterData(state)
  }),
  {
    getPeerProgressAnalysisRequestAction
  }
);

export default enhance(PeerProgressAnalysis);

const UpperContainer = styled(StyledCard)`
  .ant-card-body {
    padding: 18px 0px;
  }
`;
const PaddedContainer = styled.div`
  padding: 0px 18px;
`;

const TrendContainer = styled(Row)`
  padding-top: 5px;
`;

// -----|-----|-----|-----|-----| COMPONENT ENDED |-----|-----|-----|-----|----- //
