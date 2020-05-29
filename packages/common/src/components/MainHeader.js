import {
  extraDesktopWidthMax,
  mediumDesktopExactWidth,
  title,
  tabletWidth,
  smallDesktopWidth,
  mobileWidthMax
} from "@edulastic/colors";
import { MenuIcon } from "@edulastic/common";
import { Affix } from "antd";
import { PropTypes } from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import styled from "styled-components";
import { toggleSideBarAction } from "../../../../src/client/author/src/actions/toggleMenu";

const MainHeader = ({ children, headingText, Icon, toggleSideBar, ...restProps }) => (
  <HeaderWrapper {...restProps}>
    <Affix className="fixed-header" style={{ position: "fixed", top: 0, right: 0 }}>
      <Container {...restProps}>
        <HeaderLeftContainer headingText={headingText} {...restProps} data-cy="header-left-container">
          <MenuIcon className="hamburger" onClick={() => toggleSideBar()} />
          {Icon && (
            <TitleIcon>
              <Icon color={title} width={20} height={20} />
            </TitleIcon>
          )}
          <TitleWrapper {...restProps} title={headingText} data-cy="title">
            {headingText}
          </TitleWrapper>
          {restProps.headingSubContent}
        </HeaderLeftContainer>
        {children}
      </Container>
    </Affix>
  </HeaderWrapper>
);

MainHeader.propTypes = {
  children: PropTypes.any.isRequired,
  toggleSideBar: PropTypes.func.isRequired,
  headingText: PropTypes.string.isRequired,
  Icon: PropTypes.any.isRequired,
  t: PropTypes.any.isRequired
};

const enhance = compose(
  connect(
    null,
    {
      toggleSideBar: toggleSideBarAction
    }
  )
);

export default enhance(MainHeader);

const HeaderWrapper = styled.div`
  padding-top: ${props => props.height || props.theme.HeaderHeight.md}px;

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    left: 70px;
    z-index: 999;
  }
  @media (max-width: ${tabletWidth}) {
    .fixed-header {
      left: 0;
    }
  }

  @media (min-width: ${mediumDesktopExactWidth}) {
    padding-top: ${props => props.height || props.theme.HeaderHeight.md}px;
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    padding-top: ${props => props.height || props.theme.HeaderHeight.xl}px;
  }
  @media (max-width: ${smallDesktopWidth}) {
    padding-top: ${props => props.mobileHeaderHeight || props.theme.HeaderHeight.xs}px;
  }
  @media print {
    padding-top: 0px;
  }
`;

const Container = styled.div`
  padding: 0px 30px;
  background: ${props => props.theme.header.headerBgColor};
  display: ${props => props.display || "flex"};
  justify-content: ${props => props.justify || "space-between"};
  align-items: ${props => props.align || "center"};
  border-bottom: 1px solid #2f4151;
  height: ${props => props.height || props.theme.HeaderHeight.md}px;

  @media (min-width: ${mediumDesktopExactWidth}) {
    height: ${props => props.height || props.theme.HeaderHeight.md}px;
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    height: ${props => props.height || props.theme.HeaderHeight.xl}px;
  }
  @media (max-width: ${smallDesktopWidth}) {
    padding: 10px 20px;
    padding-bottom: 4px;
    height: ${props => props.mobileHeaderHeight || props.theme.HeaderHeight.xs}px;
    flex-wrap: wrap;
  }
`;

export const HeaderLeftContainer = styled.div`
  display: ${props => props.display || "flex"};
  align-items: ${props => props.alignItems || "center"};
  justify-content: ${props => props.justifyContent || "space-evenly"};
  flex-direction: ${props => props.flexDirection || "row"};
  flex-wrap: ${props => props.flexWrap || ""};
  width: ${props => props.width || "auto"};

  @media (min-width: ${tabletWidth}) {
    display: ${props => (!props.headingText ? "none" : "")};
  }
`;

export const TitleWrapper = styled.h1`
  font-size: 18px;
  color: ${props => props.theme.header.headerTitleTextColor};
  font-weight: bold;
  line-height: normal;
  min-width: auto;
  margin: 0px;
  white-space: nowrap;
  max-width: ${props => (props.noEllipsis ? "unset" : props.titleMaxWidth || "200px")};
  overflow: hidden;
  letter-spacing: 0.9px;
  text-overflow: ellipsis;

  @media (min-width: ${mediumDesktopExactWidth}) {
    font-size: ${props => props.theme.header.headerTitleFontSize};
    max-width: ${props => (props.noEllipsis ? "unset" : props.titleMaxWidth || "300px")};
    min-width: ${props => props.titleMinWidth || "200px"};
  }
`;

const TitleIcon = styled.span`
  display: flex;
  align-items: center;
  margin-right: 15px;
  svg {
    fill: ${props => props.theme.header.headerTitleTextColor};
  }
`;

export const HeaderMidContainer = styled.div`
  @media (max-width: ${mobileWidthMax}) {
    order: 3;
    flex-basis: 100%;
  }
`;
