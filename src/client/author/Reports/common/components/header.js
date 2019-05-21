import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Button, Col } from "antd";
import { white, fadedGrey } from "@edulastic/colors";
import { IconBarChart } from "@edulastic/icons";
import HeaderWrapper from "../../../src/mainContent/headerWrapper";
import Breadcrumb from "../../../src/components/Breadcrumb";
import FeatureWrapper from "../../../../features/components/FeatureWrapper";

export const CustomizedHeaderWrapper = ({
  breadcrumbsData,
  title,
  onShareClickCB,
  onPrintClickCB,
  onDownloadCSVClickCB,
  onRefineResultsCB
}) => {
  const [refineButtonActive, setRefineButtonActive] = useState(false);

  const _onShareClickCB = () => {
    onShareClickCB();
  };

  const _onPrintClickCB = () => {
    onPrintClickCB();
  };

  const _onDownloadCSVClickCB = () => {
    onDownloadCSVClickCB();
  };

  const _onRefineResultsCB = event => {
    setRefineButtonActive(!refineButtonActive);
    onRefineResultsCB(event, !refineButtonActive);
  };

  const ReportHeader = (
    <h1>
      <IconBarChart /> Reports
    </h1>
  );

  return (
    <HeaderWrapper>
      <HeaderTitle>
        {title !== "Reports" ? <Breadcrumb data={breadcrumbsData} style={{ position: "unset" }} /> : ReportHeader}
      </HeaderTitle>
      <StyledCol>
        <FeatureWrapper feature="shareReports" actionOnInaccessible="hidden">
          {onShareClickCB ? (
            <StyledButton shape="round" size="default" icon="share-alt" onClick={_onShareClickCB}>
              Share
            </StyledButton>
          ) : null}
        </FeatureWrapper>
        {onPrintClickCB ? (
          <StyledButton shape="round" size="default" icon="printer" onClick={_onPrintClickCB}>
            Print
          </StyledButton>
        ) : null}
        <FeatureWrapper feature="downloadReports" actionOnInaccessible="hidden">
          {onDownloadCSVClickCB ? (
            <StyledButton type="primary" shape="round" size="default" icon="download" onClick={_onDownloadCSVClickCB}>
              Download CSV
            </StyledButton>
          ) : null}
        </FeatureWrapper>
        {onRefineResultsCB ? (
          <StyledButton
            type={refineButtonActive ? "default" : "primary"}
            shape="round"
            size="default"
            icon="filter"
            onClick={_onRefineResultsCB}
          >
            Refine results
          </StyledButton>
        ) : null}
      </StyledCol>
    </HeaderWrapper>
  );
};

const StyledCol = styled(Col)`
  text-align: right;
`;

const StyledButton = styled(Button)`
  margin-left: 10px;
  font-size: 14px;
`;

const HeaderTitle = styled.div`
  h1 {
    font-size: 18px;
    font-weight: 600;
    color: white;
    margin: 0px;
    display: flex;
    align-items: center;
    svg {
      width: 30px;
      height: 30px;
      fill: white;
      margin-right: 10px;
    }
  }
  .ant-breadcrumb {
    .ant-breadcrumb-link {
      color: ${white};
      a {
        color: ${white};
      }
    }
    .ant-breadcrumb-separator {
      font-weight: normal;
      color: ${fadedGrey};
    }
  }
`;
