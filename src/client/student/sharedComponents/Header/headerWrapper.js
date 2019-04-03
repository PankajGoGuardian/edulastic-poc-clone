import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { connect } from "react-redux";
import { IconMenuOpenClose } from "@edulastic/icons";
import { tabletWidth, white } from "@edulastic/colors";
import { Affix, Layout, Row, Col } from "antd";
import { toggleSideBarAction } from "../../Sidebar/ducks";

const HeaderWrapper = ({ children, isSidebarCollapsed, toggleSideBar }) => (
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
  padding-top: 62px;
  margin-bottom: 10px;
  @media screen and (max-width: 768px) {
    padding-top: 95px;
  }
`;

const FixedHeader = styled(Affix)`
  top: 0;
  right: 0;
  position: fixed;
  z-index: 2;
  left: 100px;
  @media (max-width: 768px) {
    left: 0;
    padding-left: 60px;
    background: ${props => props.theme.headerBgColor};
  }
`;

const AssignmentsHeader = styled(Layout.Header)`
  background-color: ${props => props.theme.headerBgColor};
  color: ${props => props.theme.headerTitleTextColor};
  display: flex;
  align-items: center;
  height: 62px;
  padding: 0px 15px;
  @media screen and (max-width: 768px) {
    height: 104px;
    padding: 0;
  }
  .ant-col-24 {
    align-items: center;
    line-height: 1.2;
    display: flex;
  }
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
    top: 25px;
    left: 20px;
  }
`;
