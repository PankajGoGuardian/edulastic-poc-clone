import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { connect } from "react-redux";
import { IconMenuOpenClose } from "@edulastic/icons";
import {
  tabletWidth,
  largeDesktopWidth,
  mobileWidthMax,
  white,
  extraDesktopWidthMax,
  themeColor
} from "@edulastic/colors";
import { Affix, Layout, Row, Col } from "antd";
import { toggleSideBarAction } from "../../Sidebar/ducks";

const HeaderWrapper = ({ children, isSidebarCollapsed, toggleSideBar, borderBottom }) => (
  <HeaderContainer>
    <FixedHeader iscollapsed={isSidebarCollapsed}>
      <MenuIcon className="hamburger" onClick={() => toggleSideBar()} />
      <AssignmentsHeader>
        <HeaderRow>
          <Col span={24}>
            <Wrapper>{children}</Wrapper>
          </Col>
        </HeaderRow>
      </AssignmentsHeader>
    </FixedHeader>
  </HeaderContainer>
);

HeaderWrapper.propTypes = {
  children: PropTypes.object.isRequired,
  isSidebarCollapsed: PropTypes.bool.isRequired,
  toggleSideBar: PropTypes.func.isRequired
};

export default connect(
  ({ ui }) => ({
    isSidebarCollapsed: ui.isSidebarCollapsed
  }),
  { toggleSideBar: toggleSideBarAction }
)(HeaderWrapper);

const HeaderContainer = styled.div`
  padding-top: 76px;
  margin-bottom: 16px;
  background: ${props => props.theme.header.headerBgColor || themeColor};

  @media screen and (min-width: ${extraDesktopWidthMax}) {
    padding-top: 96px;
  }

  @media (max-width: ${largeDesktopWidth}) {
    padding-top: 60px;
    margin-bottom: 12px;
  }

  ${({ theme }) =>
    theme.respondTo.xl`
      padding-top: 100px;
    `}
`;

const FixedHeader = styled(Affix)`
  top: 0;
  right: 0;
  position: fixed;
  z-index: 2;
  left: 100px;

  @media (min-width: ${tabletWidth}) and (max-width: ${largeDesktopWidth}) {
    left: 90px;
  }

  @media (max-width: 768px) {
    left: 0;
    padding-left: 70px;
    background: ${props => props.theme.header.headerBgColor || themeColor};
  }
`;

const AssignmentsHeader = styled(Layout.Header)`
  border-bottom: ${props => (props.borderBottom ? props.borderBottom : `2px solid ${props.theme.headerBorderColor}`)};
  background-color: ${props => props.theme.header.headerBgColor || themeColor};
  color: ${props => props.theme.header.headerTitleTextColor};
  display: flex;
  align-items: center;
  height: 76px;
  padding: 0px 46px;

  @media screen and (min-width: ${extraDesktopWidthMax}) {
    padding: 0px 44px;
    height: 96px;
    padding: 0px 30px 0 40px;
  }

  @media (max-width: ${largeDesktopWidth}) {
    height: 60px;
    padding: 0px 19px 0 30px;
  }

  @media (max-width: ${mobileWidthMax}) {
    height: 60px;
    padding: 0 26px 0 0;
  }

  .ant-col-24 {
    align-items: center;
    line-height: 1.2;
    display: flex;
  }

  ${({ theme }) =>
    theme.respondTo.xl`
      height: 100px;
    `}
`;

const HeaderRow = styled(Row)`
  width: 100%;
`;

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  font-size: 17px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const MenuIcon = styled(IconMenuOpenClose)`
  display: none;
  fill: ${white};
  width: 18px;
  pointer-events: all;

  @media (max-width: ${tabletWidth}) {
    display: block;
    position: absolute;
    top: 22px;
    left: 26px;
  }
`;
