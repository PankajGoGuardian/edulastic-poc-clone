import React, { memo } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { withNamespaces } from "@edulastic/localization";
import { compose } from "redux";

import HeaderWrapper from "./headerWrapper";
import ClassSelect from "../ClassSelector";
import ShowActiveClass from "../ShowActiveClasses";

const Header = ({ t, titleText, classList, classSelect, showActiveClass, setClassList, setShowClass }) => (
  <HeaderWrapper>
    <Wrapper>
      <AssignmentTitle>{t(titleText)}</AssignmentTitle>
      {classSelect && <ClassSelect t={t} classList={classList} />}
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
  font-size: ${props => props.theme.headerTitleFontSize};
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.36;
  letter-spacing: normal;
  text-align: left;
  color: ${props => props.theme.header.headerTitleTextColor};

  ${({ theme }) =>
    theme.respondTo.xl`
      padding-bottom: 20px;
    `}

  @media screen and (max-width: 768px) {
    padding-left: 0;
  }
`;
