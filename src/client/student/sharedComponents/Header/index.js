import React, { memo } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { withNamespaces } from "@edulastic/localization";
import { compose } from "redux";

import HeaderWrapper from "./headerWrapper";
import ClassSelect from "../ClassSelector";
import ShowActiveClass from "../ShowActiveClasses";
import { smallDesktopWidth, tabletWidth } from "@edulastic/colors";

const Header = ({
  t,
  titleText,
  classList,
  classSelect,
  showActiveClass,
  setClassList,
  setShowClass,
  isDocBased,
  showAllClassesOption = true
}) => (
  <HeaderWrapper isDocBased={isDocBased}>
    <Wrapper>
      <AssignmentTitle>{t(titleText)}</AssignmentTitle>
      {classSelect && <ClassSelect t={t} classList={classList} showAllClassesOption={showAllClassesOption} />}
      {showActiveClass && (
        <ShowActiveClass t={t} classList={classList} setClassList={setClassList} setShowClass={setShowClass} />
      )}
    </Wrapper>
  </HeaderWrapper>
);

Header.propTypes = {
  t: PropTypes.func.isRequired,
  titleText: PropTypes.string.isRequired,
  classSelect: PropTypes.bool.isRequired,
  showActiveClass: PropTypes.bool.isRequired
};

const enhance = compose(
  memo,
  withNamespaces("header")
);

export default enhance(Header);

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  font-size: 17px;
`;

export const AssignmentTitle = styled.div`
  font-family: Open Sans;
  font-size: ${props => props.theme.header.headerTitleFontSize};
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.36;
  letter-spacing: normal;
  text-align: left;
  color: ${props => props.theme.header.headerTitleTextColor};
  @media screen and (max-width: ${smallDesktopWidth}) {
    font-size: ${props => props.theme.titleSecondarySectionFontSize};
  }
  @media screen and (max-width: ${tabletWidth}) {
    padding-left: 0;
  }
`;
