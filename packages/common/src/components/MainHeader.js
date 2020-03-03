import {
  desktopWidth,
  extraDesktopWidthMax,
  mediumDesktopExactWidth,
  title,
  mediumDesktopWidth,
  tabletWidth,
  smallDesktopWidth,
  mobileWidthMax
} from "@edulastic/colors";
import { MenuIcon } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { Affix } from "antd";
import { PropTypes } from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import styled from "styled-components";
import { toggleSideBarAction } from "../../../../src/client/author/src/actions/toggleMenu";

const MainHeader = ({ children, headingText, Icon, t, toggleSideBar, ...restProps }) => (
  <HeaderWrapper {...restProps}>
    <Affix className="fixed-header" style={{ position: "fixed", top: 0, right: 0 }}>
      <Container {...restProps}>
        <HeaderLeftContainer headingText={headingText} {...restProps}>
          <MenuIcon className="hamburger" onClick={() => toggleSideBar()} />
          {Icon && (
            <TitleIcon>
              <Icon color={title} width={20} height={20} />
            </TitleIcon>
          )}
          <TitleWrapper {...restProps} title={t(headingText)} data-cy="title">
            {t(headingText)}
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
  withNamespaces("header"),
  connect(
    null,
    {
      toggleSideBar: toggleSideBarAction
    }
  )
);

export default enhance(MainHeader);

const HeaderWrapper = styled.div`
  padding-top: ${props => props.height || props.theme.HeaderHeight.xs}px;

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
  @media (max-width: ${desktopWidth}) {
    padding-top: ${props => props.mobileHeaderHeight || ""}px;
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
  height: ${props => props.height || props.theme.HeaderHeight.xs}px;

  @media (min-width: ${mediumDesktopExactWidth}) {
    height: ${props => props.height || props.theme.HeaderHeight.md}px;
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    height: ${props => props.height || props.theme.HeaderHeight.xl}px;
  }
  @media (max-width: ${desktopWidth}) {
    padding: 10px 20px;
    height: ${props => props.mobileHeaderHeight || ""}px;
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
  font-size: ${props => props.theme.header.headerTitleFontSize};
  color: ${props => props.theme.header.headerTitleTextColor};
  font-weight: bold;
  line-height: normal;
  min-width: ${props => props.titleMinWidth || "200px"};
  margin: 0px;
  white-space: nowrap;
  max-width: ${props => (props.noEllipsis ? "unset" : "300px")};
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: ${mediumDesktopWidth}) {
    max-width: ${props => (props.noEllipsis ? "unset" : "300px")};
    font-size: 18px;
  }

  @media (max-width: ${smallDesktopWidth}) {
    max-width: ${props => (props.noEllipsis ? "unset" : "200px")};
    min-width: auto;
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
