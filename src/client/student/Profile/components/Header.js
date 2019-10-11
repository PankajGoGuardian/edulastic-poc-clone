import React, { memo } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { withNamespaces } from "@edulastic/localization";
import { compose } from "redux";
import { connect } from "react-redux";
import { MenuIcon } from "@edulastic/common";
import {
  mediumDesktopWidth,
  themeColor,
  extraDesktopWidthMax,
  largeDesktopWidth,
  mobileWidthMax
} from "@edulastic/colors";
import { toggleSideBarAction } from "../../Sidebar/ducks";

const ProfileHeader = ({ t, toggleSideBar }) => (
  <ProfileHeaderWrapper borderBottom="none">
    <MenuIcon className="hamburger" onClick={() => toggleSideBar()} />
    <Title>{t("common.profileTitle")}</Title>
  </ProfileHeaderWrapper>
);

ProfileHeader.propTypes = {
  t: PropTypes.func.isRequired
};

const enhance = compose(
  memo,
  withNamespaces("header"),
  connect(
    null,
    { toggleSideBar: toggleSideBarAction }
  )
);

export default enhance(ProfileHeader);

const Title = styled.h1`
  color: ${props => props.theme.header.headerTitleTextColor};
  font-size: ${props => props.theme.header.headerTitleFontSize};
  font-weight: bold;
  margin: 0;
  padding: 0;
`;

const ProfileHeaderWrapper = styled.div`
  background: ${props => props.theme.headerBgColor || themeColor};
  height: 76px;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0px 40px;

  @media screen and (min-width: ${extraDesktopWidthMax}) {
    height: 96px;
  }
  @media (max-width: ${largeDesktopWidth}) {
    height: 60px;
    padding: 0px 30px;
  }
`;
