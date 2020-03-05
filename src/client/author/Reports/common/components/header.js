import { themeColor } from "@edulastic/colors";
import { EduButton, MainHeader } from "@edulastic/common";
import { IconBarChart, IconFilter } from "@edulastic/icons";
import { Button, Col, Icon } from "antd";
import React, { useState } from "react";
import styled from "styled-components";
import FeaturesSwitch from "../../../../features/components/FeaturesSwitch";
import Breadcrumb from "../../../src/components/Breadcrumb";
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

  return (
    <div>
      <MainHeader
        mobileHeaderHeight={activeNavigationKey !== "standard-reports" ? 100 : ""}
        headingText="common.reports"
        Icon={IconBarChart}
      >
        {navigationItems.length ? (
          activeNavigationKey === "standard-reports" ? (
            <FeaturesSwitch inputFeatures="customReport" actionOnInaccessible="hidden" key="customReport">
              <HeaderNavigation navigationItems={navigationItems} activeItemKey={activeNavigationKey} />
            </FeaturesSwitch>
          ) : (
            <HeaderNavigation navigationItems={navigationItems} activeItemKey={activeNavigationKey} />
          )
        ) : null}
        <StyledCol>
          <FeaturesSwitch inputFeatures="shareReports" actionOnInaccessible="hidden">
            {onShareClickCB ? (
              <EduButton isGhost IconBtn title="Share" onClick={_onShareClickCB}>
                <Icon type="share-alt" />
              </EduButton>
            ) : null}
          </FeaturesSwitch>
          {onPrintClickCB ? (
            <EduButton isGhost IconBtn title="Print" onClick={_onPrintClickCB}>
              <Icon type="printer" />
            </EduButton>
          ) : null}
          <FeaturesSwitch inputFeatures="downloadReports" actionOnInaccessible="hidden">
            {onDownloadCSVClickCB ? (
              <EduButton isGhost IconBtn title="Download CSV" onClick={_onDownloadCSVClickCB}>
                <Icon type="download" />
              </EduButton>
            ) : null}
          </FeaturesSwitch>
        </StyledCol>
      </MainHeader>
      <SecondaryHeader>
        <HeaderTitle>
          {title !== "Reports" ? <Breadcrumb data={breadcrumbsData} style={{ position: "unset" }} /> : null}
        </HeaderTitle>
        {onRefineResultsCB ? (
          <StyledButton display="flex" type="default" shape="round" onClick={_onRefineResultsCB}>
            <i className="anticon">
              <IconFilter color={themeColor} width={20} height={20} />
            </i>
            REFINE RESULTS
            <ArrowIcon type={refineButtonActive ? "up" : "down"} />
          </StyledButton>
        ) : null}
      </SecondaryHeader>
    </div>
  );
};

const ArrowIcon = styled(Icon)`
  height: 14px;
`;

const StyledCol = styled(Col)`
  text-align: right;
  display: flex;
`;

const StyledButton = styled(Button)`
  &.ant-btn {
    display: ${({ display }) => display || "unset"};
    align-items: ${({ display }) => (display === "flex" ? "center" : "unset")};
    margin-left: 5px;
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
  padding: 15px 30px;
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
