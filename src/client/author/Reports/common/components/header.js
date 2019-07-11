import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Button, Col } from "antd";
import { white, fadedGrey, themeColorLight, themeColor } from "@edulastic/colors";
import { IconBarChart } from "@edulastic/icons";
import HeaderWrapper from "../../../src/mainContent/headerWrapper";
import Breadcrumb from "../../../src/components/Breadcrumb";
import FeaturesSwitch from "../../../../features/components/FeaturesSwitch";

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
        <FeaturesSwitch inputFeatures="shareReports" actionOnInaccessible="hidden">
          {onShareClickCB ? (
            <StyledButton shape="round" icon="share-alt" onClick={_onShareClickCB}>
              Share
            </StyledButton>
          ) : null}
        </FeaturesSwitch>
        {onPrintClickCB ? (
          <StyledButton shape="round" icon="printer" onClick={_onPrintClickCB}>
            Print
          </StyledButton>
        ) : null}
        <FeaturesSwitch inputFeatures="downloadReports" actionOnInaccessible="hidden">
          {onDownloadCSVClickCB ? (
            <StyledButton shape="round" icon="download" onClick={_onDownloadCSVClickCB}>
              Download CSV
            </StyledButton>
          ) : null}
        </FeaturesSwitch>
        {onRefineResultsCB ? (
          <StyledButton
            type={refineButtonActive ? "primary" : "default"}
            shape="round"
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
  text-shadow: none;
  font-weight: 400;
  &.ant-btn-primary {
    background: ${themeColorLight};
    color: ${white};
    font-weight: 400;
    &:hover,
    &:focus {
      background: ${themeColorLight};
      color: ${white};
    }
  }
  &:hover,
  &:focus {
    border-color: ${themeColor};
    color: ${themeColor};
  }
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
