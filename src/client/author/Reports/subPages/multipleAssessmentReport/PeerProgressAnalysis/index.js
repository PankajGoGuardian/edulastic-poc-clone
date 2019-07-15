import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { get } from "lodash";
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
import { parseData, augmentWithData } from "./utils/transformers";
import { ControlDropDown } from "../../../common/components/widgets/controlDropDown";

import dropDownData from "./static/json/dropDownData.json";

// -----|-----|-----|-----|-----| COMPONENT BEGIN |-----|-----|-----|-----|----- //

const usefetchProgressHook = (settings, compareBy, fetchAction) => {
  useEffect(() => {
    const { requestFilters = {} } = settings;
    const { termId = "" } = requestFilters;

    if (termId) {
      fetchAction({
        compareBy,
        termId
      });
    }
  }, [settings, compareBy]);
};

const PeerProgressAnalysis = ({
  getPeerProgressAnalysisRequestAction,
  peerProgressAnalysis,
  MARFilterData,
  settings,
  loading,
  role
}) => {
  const [compareBy, setCompareBy] = useState("school");
  const [analyseBy, setAnalyseBy] = useState("score");

  usefetchProgressHook(settings, compareBy, getPeerProgressAnalysisRequestAction);
  const { metricInfo = [] } = get(peerProgressAnalysis, "data.result", {});
  const { orgData = [], testData = [] } = get(MARFilterData, "data.result", []);

  const parsedData = parseData(metricInfo, compareBy, orgData);
  const augmentedData = augmentWithData(parsedData, compareBy, orgData);

  console.log(dropDownData, "dropDownData");

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
              <TrendCard type="up" />
            </PaddedContainer>
          </Col>
          <Col span={8}>
            <PaddedContainer>
              <TrendCard type="flat" />
            </PaddedContainer>
          </Col>
          <Col span={8}>
            <PaddedContainer>
              <TrendCard type="down" />
            </PaddedContainer>
          </Col>
        </TrendContainer>
      </UpperContainer>
      <StyledCard>
        <Row>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <StyledH3>How well are student sub-groups progressing ?</StyledH3>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <Row type="flex" justify="end">
              <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                <ControlDropDown
                  prefix="Analyse By"
                  by={dropDownData.analyseByData[0]}
                  selectCB={({ key }) => setAnalyseBy(key)}
                  data={dropDownData.analyseByData}
                />
              </Col>
              <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                <ControlDropDown
                  prefix="Compare By"
                  by={dropDownData.compareByData[0]}
                  selectCB={({ key }) => setCompareBy(key)}
                  data={dropDownData.compareByData}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col>
            <PeerProgressAnalysisTable
              data={augmentedData}
              testData={testData}
              compareBy={compareBy}
              analyseBy={analyseBy}
            />
          </Col>
        </Row>
      </StyledCard>
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
