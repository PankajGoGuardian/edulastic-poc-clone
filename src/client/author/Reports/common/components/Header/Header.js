import React, { Fragment } from "react";
import { Dropdown, Menu, Col, Icon } from "antd";
import { Link } from "react-router-dom";
import { withNamespaces } from "react-i18next";
import styled from "styled-components";
import { themeColor, smallDesktopWidth, tabletWidth } from "@edulastic/colors";
import { EduButton, MainHeader, withWindowSizes } from "@edulastic/common";
import { IconBarChart, IconMoreVertical } from "@edulastic/icons";
import FeaturesSwitch from "../../../../../features/components/FeaturesSwitch";
import HeaderNavigation from "./HeaderNavigation";

const CustomizedHeaderWrapper = ({
  windowWidth,
  onShareClickCB,
  onPrintClickCB,
  onDownloadCSVClickCB,
  navigationItems = [],
  activeNavigationKey = "",
  hideSideMenu,
  isCliUser,
  t
}) => {
  const _onPrintClickCB = () => {
    onPrintClickCB();
  };

  const _onDownloadCSVClickCB = () => {
    onDownloadCSVClickCB();
  };

  const isSmallDesktop = windowWidth >= parseInt(tabletWidth, 10) && windowWidth <= parseInt(smallDesktopWidth, 10);

  let filterNavigationItems = navigationItems;
  if (isCliUser) {
    filterNavigationItems = navigationItems.filter(item => item.key !== "peer-performance");
  }
  const availableNavItems = isSmallDesktop
    ? filterNavigationItems.filter(ite => ite.key === activeNavigationKey)
    : filterNavigationItems;

  const ActionButtonWrapper = isSmallDesktop ? Menu : Fragment;
  const ActionButton = isSmallDesktop ? Menu.Item : EduButton;
  
  const navMenu = isSmallDesktop
    ? filterNavigationItems
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
      {/* TODO: Uncomment and add support for sharing reports */}
      {/* <FeaturesSwitch inputFeatures="shareReports" actionOnInaccessible="hidden">
        {onShareClickCB ? (
          <ActionButton isGhost IconBtn title="Share" onClick={_onShareClickCB}>
            <Icon type="share-alt" />
            {isSmallDesktop && <span>Share</span>}
          </ActionButton>
        ) : null}
      </FeaturesSwitch> */}
      {onPrintClickCB ? (
        <ActionButton isBlue isGhost IconBtn title="Print" onClick={_onPrintClickCB}>
          <Icon type="printer" />
          {isSmallDesktop && <span>Print</span>}
        </ActionButton>
      ) : null}
      <FeaturesSwitch inputFeatures="downloadReports" actionOnInaccessible="hidden">
        {onDownloadCSVClickCB ? (
          <ActionButton isBlue isGhost IconBtn title="Download CSV" onClick={_onDownloadCSVClickCB}>
            <Icon type="download" />
            {isSmallDesktop && <span>Download CSV</span>}
          </ActionButton>
        ) : null}
      </FeaturesSwitch>
      {/* {activeNavigationKey === "standard-reports" && (
        <ActionButton isBlue>
          <IconQuestionCircle />
          <span>HOW TO USE INSIGHTS</span>
        </ActionButton>
      )} */}
    </ActionButtonWrapper>
  );

  return (
    <MainHeader
      mobileHeaderHeight={activeNavigationKey !== "standard-reports" ? 100 : ""}
      headingText={t("common.reports")}
      Icon={IconBarChart}
      hideSideMenu={hideSideMenu}
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
  );
};

export default withNamespaces("header")(withWindowSizes(CustomizedHeaderWrapper));

const StyledCol = styled(Col)`
  text-align: right;
  display: flex;
`;
