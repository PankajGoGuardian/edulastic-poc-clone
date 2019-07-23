import React, { useState } from "react";
import styled from "styled-components";
import { Button, Col, Icon } from "antd";
import { themeColor } from "@edulastic/colors";
import HeaderWrapper from "../../../src/mainContent/headerWrapper";
import Breadcrumb from "../../../src/components/Breadcrumb";
import FeaturesSwitch from "../../../../features/components/FeaturesSwitch";
import HeaderNavigation from "./Header/HeaderNavigation";

export const CustomizedHeaderWrapper = ({
  breadcrumbsData,
  title,
  onShareClickCB,
  onPrintClickCB,
  onDownloadCSVClickCB,
  onRefineResultsCB,
  navigationItems = [],
  activeNavigationKey = ""
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

  console.log(navigationItems, "navigationItems");

  return (
    <div>
      <HeaderWrapper>
        <HeaderTitle>
          <h1>Reports</h1>
        </HeaderTitle>
        {navigationItems.length ? (
          <HeaderNavigation navigationItems={navigationItems} activeItemKey={activeNavigationKey} />
        ) : null}
        <StyledCol>
          <FeaturesSwitch inputFeatures="shareReports" actionOnInaccessible="hidden">
            {onShareClickCB ? (
              <IconButton shape="round" onClick={_onShareClickCB}>
                <Icon type="share-alt" />
              </IconButton>
            ) : null}
          </FeaturesSwitch>
          {onPrintClickCB ? (
            <IconButton shape="round" onClick={_onPrintClickCB}>
              <Icon type="printer" />
            </IconButton>
          ) : null}
          <FeaturesSwitch inputFeatures="downloadReports" actionOnInaccessible="hidden">
            {onDownloadCSVClickCB ? (
              <IconButton shape="round" onClick={_onDownloadCSVClickCB}>
                <Icon type="download" />
              </IconButton>
            ) : null}
          </FeaturesSwitch>
        </StyledCol>
      </HeaderWrapper>
      <SecondaryHeader>
        <HeaderTitle>
          {title !== "Reports" ? <Breadcrumb data={breadcrumbsData} style={{ position: "unset" }} /> : null}
        </HeaderTitle>
        {onRefineResultsCB ? (
          <StyledButton type={"default"} shape="round" icon="filter" onClick={_onRefineResultsCB}>
            REFINE RESULTS
            <Icon type={refineButtonActive ? "up" : "down"} />
          </StyledButton>
        ) : null}
      </SecondaryHeader>
    </div>
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
  border-radius: 3px;
  border-color: transparent;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  color: ${themeColor};
  &:hover,
  &:active,
  &:focus {
    color: ${themeColor};
    border-color: transparent;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  }
  &::after {
    display: none !important;
  }
`;

const HeaderTitle = styled.div`
  h1 {
    font-size: 25px;
    font-weight: bold;
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
`;

const SecondaryHeader = styled.div`
  padding: 15px 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media print {
    display: none;
  }
`;
const IconButton = styled(StyledButton)`
  font-size: 16px;
  padding-right: 11px;
  padding-left: 11px;
  height: 40px;
`;
