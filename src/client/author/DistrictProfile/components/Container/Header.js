import React, { memo } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { withNamespaces } from "@edulastic/localization";
import { compose } from "redux";
import HeaderWrapper from "../../../../student/sharedComponents/Header/headerWrapper";

const ProfileHeader = ({ t }) => (
  <HeaderWrapper>
    <Title>{t("common.profileTitle")}</Title>
  </HeaderWrapper>
);

ProfileHeader.propTypes = {
  t: PropTypes.func.isRequired
};

const enhance = compose(
  memo,
  withNamespaces("header")
);

export default enhance(ProfileHeader);

const Title = styled.h1`
  color: white;
  font-size: 22px;
  font-weight: bold;
  margin: 0;
  padding: 0;
`;
