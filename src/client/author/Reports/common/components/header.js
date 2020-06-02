import React, { useState, Fragment } from "react";
import { Dropdown, Menu, Button, Col, Icon } from "antd";
import { Link } from "react-router-dom";
import { withNamespaces } from "react-i18next";
import styled from "styled-components";
import { themeColor, desktopWidth, smallDesktopWidth, tabletWidth } from "@edulastic/colors";
import { EduButton, MainHeader, withWindowSizes } from "@edulastic/common";
import { IconBarChart, IconFilter, IconMoreVertical } from "@edulastic/icons";
import FeaturesSwitch from "../../../../features/components/FeaturesSwitch";
import Breadcrumb from "../../../src/components/Breadcrumb";
import HeaderNavigation from "./Header/HeaderNavigation";

const CustomizedHeaderWrapper = ({
  breadcrumbsData,
  title,
  windowWidth,
  onShareClickCB,
  onPrintClickCB,
  onDownloadCSVClickCB,
  onRefineResultsCB,
  navigationItems = [],
  activeNavigationKey = "",
  t
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
  const isSmallDesktop = windowWidth >= parseInt(tabletWidth, 10) && windowWidth <= parseInt(smallDesktopWidth, 10);

  const availableNavItems = isSmallDesktop
    ? navigationItems.filter(ite => ite.key === activeNavigationKey)
    : navigationItems;

  const ActionButtonWrapper = isSmallDesktop ? Menu : Fragment;
  const ActionButton = isSmallDesktop ? Menu.Item : EduButton;
  const navMenu = isSmallDesktop
    ? navigationItems
        .filter(ite => ite.key !== activeNavigationKey)
        .map(ite => (
          <ActionButton key={ite.key}>
            <Link to={ite.location}>{ite.title}</Link>
          </ActionButton>
        ))
    : null;

  const actionRightButtons = (
    <ActionButtonWrapper>
      {navMenu}
      <FeaturesSwitch inputFeatures="shareReports" actionOnInaccessible="hidden">
        {onShareClickCB ? (
          <ActionButton isGhost IconBtn title="Share" onClick={_onShareClickCB}>
            <Icon type="share-alt" />
            {isSmallDesktop && <span>Share</span>}
          </ActionButton>
        ) : null}
      </FeaturesSwitch>
      {onPrintClickCB ? (
        <ActionButton isGhost IconBtn title="Print" onClick={_onPrintClickCB}>
          <Icon type="printer" />
          {isSmallDesktop && <span>Print</span>}
        </ActionButton>
      ) : null}
      <FeaturesSwitch inputFeatures="downloadReports" actionOnInaccessible="hidden">
        {onDownloadCSVClickCB ? (
          <ActionButton isGhost IconBtn title="Download CSV" onClick={_onDownloadCSVClickCB}>
            <Icon type="download" />
            {isSmallDesktop && <span>Download CSV</span>}
          </ActionButton>
        ) : null}
      </FeaturesSwitch>
    </ActionButtonWrapper>
  );

  return (
    <div>
      <MainHeader
        mobileHeaderHeight={activeNavigationKey !== "standard-reports" ? 100 : ""}
        headingText={t("common.reports")}
        Icon={IconBarChart}
      >
        {navigationItems.length ? (
          activeNavigationKey === "standard-reports" ? (
            <FeaturesSwitch inputFeatures="customReport" actionOnInaccessible="hidden" key="customReport">
              <HeaderNavigation navigationItems={availableNavItems} activeItemKey={activeNavigationKey} />
            </FeaturesSwitch>
          ) : (
            <HeaderNavigation navigationItems={availableNavItems} activeItemKey={activeNavigationKey} />
          )
        ) : null}
        <StyledCol>
          {!isSmallDesktop && actionRightButtons}
          {isSmallDesktop && (
            <Dropdown overlay={actionRightButtons} trigger={["click"]}>
              <EduButton isGhost IconBtn>
                <IconMoreVertical color={themeColor} />
              </EduButton>
            </Dropdown>
          )}
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

export default withNamespaces("header")(withWindowSizes(CustomizedHeaderWrapper));

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
