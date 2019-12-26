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
  themeColor,
  mediumDesktopExactWidth
} from "@edulastic/colors";
import { Affix, Layout, Row, Col } from "antd";
import { toggleSideBarAction } from "../../Sidebar/ducks";

const HeaderWrapper = ({ children, toggleSideBar, isDocBased }) => (
  <HeaderContainer isDocBased={isDocBased}>
    <FixedHeader>
      <MenuIcon className="hamburger" onClick={() => toggleSideBar()} />
      <AssignmentsHeader isDocBased={isDocBased}>
        <HeaderRow>
          <StyledCol span={24}>
            <Wrapper>{children}</Wrapper>
          </StyledCol>
        </HeaderRow>
      </AssignmentsHeader>
    </FixedHeader>
  </HeaderContainer>
);

HeaderWrapper.propTypes = {
  children: PropTypes.object.isRequired,
  toggleSideBar: PropTypes.func.isRequired
};

export default connect(
  null,
  { toggleSideBar: toggleSideBarAction }
)(HeaderWrapper);

const HeaderContainer = styled.div`
  height: ${props => props.theme.HeaderHeight.xs}px;
  margin-bottom: ${props => (props.isDocBased ? "0px" : "16px")};
  background: ${props => props.theme.header.headerBgColor || themeColor};

  @media (min-width: ${mediumDesktopExactWidth}) {
    height: ${props => props.theme.HeaderHeight.md}px;
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    height: ${props => props.theme.HeaderHeight.xl}px;
  }
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
  height: ${props => props.theme.HeaderHeight.xs}px;
  padding: ${props => (props.isDocBased ? "0px 25px" : "0px 40px")};

  @media (min-width: ${mediumDesktopExactWidth}) {
    height: ${props => props.theme.HeaderHeight.md}px;
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    height: ${props => props.theme.HeaderHeight.xl}px;
  }
  @media (max-width: ${mobileWidthMax}) {
    padding: 0 26px 0 0;
  }

  .ant-col-24 {
    align-items: center;
    line-height: 1.2;
    display: flex;
  }
`;

const StyledCol = styled(Col)`
  align-items: center;
  line-height: 1.2;
  display: flex;
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
